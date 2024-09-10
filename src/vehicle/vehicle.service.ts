import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVehicleInput } from './dto/create-vehicle.input';
import { UpdateVehicleInput } from './dto/update-vehicle.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Bid, Prisma, Vehicle } from '@prisma/client';
import { VehicleWhereUniqueInput } from './dto/unique-vehicle.input';
import { InjectQueue } from '@nestjs/bullmq';
import { delay, Job, Queue,Worker } from 'bullmq';
import { RedisOptions } from 'ioredis';
import { CreateBidInput } from 'src/bid/dto/create-bid.input';
import Redis from 'ioredis';


@Injectable()
export class VehicleService {
  private readonly redis: Redis;
  constructor(private readonly prisma:PrismaService,
    @InjectQueue('vehicle-bid') private readonly vehicleBidQueue: Queue
  ){}
  

  async createVehicle(id: string,userId: string,eventId: string,createVehicleInput: CreateVehicleInput): Promise<Vehicle | null> {
    try {
      const event = await this.prisma.event.findUnique({
        where: { id: eventId },
      });
  
      if (!event) {
        throw new Error('Event not found');
      }

      const lastVehicle = await this.prisma.vehicle.findFirst({
        where: { eventId: eventId },
        orderBy: { bidTimeExpire: 'desc' }, 
      });

      let bidStartTime: Date;
      let bidTimeExpire: Date;
  
      if (!lastVehicle) {
        bidStartTime = new Date(event.startDate);
        bidTimeExpire = new Date(event.endDate);
        await this.prisma.event.update({
              where: { id: eventId },
              data: { endDate: bidTimeExpire, firstVehicleEndDate: bidTimeExpire},
            });
      } 
      else {
        bidStartTime = new Date(event.startDate);
        const bidexpire = new Date(lastVehicle.bidTimeExpire);
        bidTimeExpire = new Date(bidexpire.getTime() + event.gapInBetweenVehicles * 60000);
      }
      
      const vehicle = await this.prisma.vehicle.create({
        data: {
          ...createVehicleInput,
          currentBidUserId: userId,
          eventId: eventId,
          createdById: id,
          bidStartTime: bidStartTime,
          bidTimeExpire: bidTimeExpire,
        },
      });
      
      if (event.eventCategory === 'offline') {
        const eventStartTime = new Date(event.startDate).getTime(); // Event start time in milliseconds
        const currentVehicleCount = await this.vehicleBidQueue.count(); // Count the number of vehicles in the queue
    
        // Calculate the delay based on the event start time and the number of vehicles already in the queue
        const delay = Math.max(eventStartTime - Date.now(), 0) + currentVehicleCount * 5 * 60 * 1000; // 5 minutes per vehicle
    
        await this.vehicleBidQueue.add(vehicle.id, { vehicle }, { delay });
      }
      return vehicle;

    } 
    catch(error){
              throw new Error(error.message)
           }
    }

  async vehicles(): Promise<Vehicle[] | null>{
    const vehicle = await this.prisma.vehicle.findMany({where:{isDeleted:false}});
    if(!vehicle) throw new NotFoundException("Vehicle Not Found");
    return vehicle;
  }

  async vehicle(where:VehicleWhereUniqueInput) : Promise<Vehicle | null> {
    const vehicle = await this.prisma.vehicle.findUnique({where:{...where as Prisma.VehicleWhereUniqueInput,isDeleted:false}});
    if(!vehicle) throw new NotFoundException("Vehicle Not found");
    return vehicle;
  }

  async updateVehicle(id:string,updateVehicleInput: UpdateVehicleInput) : Promise<Vehicle|null>{
    try {
      const vehicle = await this.prisma.vehicle.findUnique({where:{id,isDeleted:false,}})
      if(!vehicle) throw new NotFoundException("Vehicle Not Found");
      return await this.prisma.vehicle.update({
          where:{
            id,
          },
          data:{
            ...updateVehicleInput,
          }
        });
      }
    catch (error) {
        if (error instanceof NotFoundException) {
          throw new Error(error.message); 
          }
        }
    }

  async deleteVehicle(id: string) : Promise<Vehicle|null>{
    const vehicle = await this.prisma.vehicle.findUnique({where:{id,isDeleted:false,}});
    if(!vehicle) throw new NotFoundException("Vehicle Not Found");
    return await this.prisma.vehicle.update({
        where:{id},
        data:{
          isDeleted:true,
        }
      });
    }

  async deletedVehicles(): Promise<Vehicle[]|null> {
    const vehicle = await this.prisma.vehicle.findMany({where:{isDeleted:true}});
    if(!vehicle) throw new NotFoundException("Vehicle Not Found");
    return vehicle;
  }

  async deletedVehicle(id:string):Promise<Vehicle|null> {
    const vehicle = await this.prisma.vehicle.findUnique({where:{id,isDeleted:true}});
    if(!vehicle) throw new NotFoundException("Vehicle Not Found");
    return vehicle;
  }
   
  async restoreVehicle(where:VehicleWhereUniqueInput):Promise<Vehicle|null>{
    const vehicle = await this.prisma.vehicle.findUnique({where:{...where as Prisma.VehicleWhereUniqueInput,isDeleted:true}});
    if(!vehicle) throw new NotFoundException("vehicle Not Found");
    return await this.prisma.vehicle.update({
      where:{...where as Prisma.VehicleWhereUniqueInput},
      data:{
        isDeleted:false,
      }
    });
  }

  async placeBid(userId: string, bidVehicleId: string, createBidInput: CreateBidInput): Promise<Bid | null> {
    const lockKey = `vehicle-lock:${bidVehicleId}`;
    try {
      // Lock the job to prevent concurrent bids
      const isLocked = await this.redis.set(lockKey, 'locked', 'EX', 60); // Lock for 60 seconds
      if (!isLocked) {
        console.log(`Job ${bidVehicleId} is already locked.`);
        return null;
      }
  
      // Create a new bid
      const result = await this.prisma.bid.create({
        data: {
          ...createBidInput,
          userId: userId,
          bidVehicleId: bidVehicleId,
        },
      });
  
      // Fetch the vehicle job from the queue
      const jobs = await this.vehicleBidQueue.getJobs(['waiting', 'delayed']);
      const vehicleJob = jobs.find((job) => job.data?.vehicle?.id === bidVehicleId);
  
      if (!vehicleJob) {
        console.log(`Vehicle Job with ID ${bidVehicleId} not found or job data is missing.`);
        return result;
      }
  
      // Get the current delay and calculate the new delay
      const currentDelay = vehicleJob.opts.delay || 0;
      const additionalDelay = 2 * 60 * 1000; // 2 minutes in milliseconds
      const newDelay = currentDelay + additionalDelay;
  
      // Update the job's delay
      await vehicleJob.changeDelay(newDelay);
  
      // Calculate and log the new run time
      const newRunTime = new Date(Date.now() + newDelay);
      console.log(`Vehicle ID ${bidVehicleId} delay extended by 2 minutes. New run time: ${newRunTime.toLocaleTimeString()}`);
  
      return result;
    } catch (error) {
      console.error('Error placing bid:', error.message);
      throw new Error('Failed to place bid');
    } finally {
      // Release the lock after operation completes
      await this.redis.del(lockKey);
    }
  }
  
  
  async listVehicleFromQueue(): Promise<Vehicle[] | null> {
    try {
      const jobs = await this.vehicleBidQueue.getJobs(['waiting', 'delayed']);
  
      if (!jobs || jobs.length === 0) {
        console.log('No jobs found in the waiting or delayed state.');
        return [];
      }
  
      const now = Date.now(); // Use timestamp for current time
      const vehiclesWithBidTimes = [];
  
      for (const job of jobs) {
        const jobState = await job.getState();
        if (!jobState) {
          console.log(`Job with ID ${job.id} does not have a state.`);
          continue;
        }
  
        if (!job.data || !job.data.vehicle) {
          console.log(`Job with ID ${job.id} does not have vehicle data.`);
          continue;
        }
  
        const vehicle = job.data.vehicle;
        const bidStartTime = new Date(vehicle.bidStartTime).getTime();
        const delayDuration = vehicle.delay || 5 * 60 * 1000; 
  
        if (isNaN(bidStartTime)) {
          console.log(`Invalid bid start time for vehicle ID ${vehicle.id}.`);
          continue;
        }
  
        const bidEndTime = bidStartTime + delayDuration;
  
        if (jobState === 'delayed') {
          vehiclesWithBidTimes.push({
            vehicle,
            bidStartTime,
            bidEndTime,
          });
        }
      }
  
      if (vehiclesWithBidTimes.length === 0) {
        console.log('No vehicles to activate.');
        return [];
      }
  
      
      vehiclesWithBidTimes.sort((a, b) => a.bidStartTime - b.bidStartTime);
  
      let lastActivationEndTime = 0; 
      const vehiclesToActivate = [];
  
      for (const v of vehiclesWithBidTimes) {
        if (now >= v.bidStartTime && now <= v.bidEndTime && now >= lastActivationEndTime) {
          vehiclesToActivate.push({
            ...v.vehicle,
            bidStartTime: new Date(v.bidStartTime),
            bidTimeExpire: new Date(v.bidEndTime),
          });
  
          lastActivationEndTime = v.bidEndTime + (v.vehicle.delay || 5 * 60 * 1000);
        }
      }
  
      if (vehiclesToActivate.length === 0) {
        console.log('No vehicle is ready to be activated at this time.');
        return [];
      }
  
      console.log('Activating Vehicles:', vehiclesToActivate);
  
      return vehiclesToActivate;
    } catch (error) {
      console.error('Error retrieving jobs from the queue:', error);
      return [];
    }
  }
  
  

  
  


    
}

  
  



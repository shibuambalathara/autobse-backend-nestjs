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
  ){this.redis = new Redis({ host: 'localhost',
    port: 6379,
  password:"redis"});}
  

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
      // Create a new bid
      const result = await this.prisma.bid.create({
        data: {
          ...createBidInput,
          userId: userId,
          bidVehicleId: bidVehicleId
        }
      });
  
      // Check if the job is locked
      const isLocked = await this.redis.set(lockKey, 'locked', 'EX', 60); // Lock for 60 seconds
      
      if (!isLocked) {
        console.log(`Job ${bidVehicleId} is already locked.`);
        return result;
      }
  
      // Fetch the vehicle job from the queue using the bidVehicleId
      const jobs = await this.vehicleBidQueue.getJobs(['waiting', 'delayed']);
      const vehicleJob = jobs.find(job => job.data?.vehicle?.id === bidVehicleId);
  
      if (!vehicleJob) {
        console.log(`Vehicle Job with ID ${bidVehicleId} not found or job data is missing.`);
        return result;
      }
  
      // Log job data for debugging
      console.log('Job data:', vehicleJob.data);
  
      // Get the current delay and calculate the new delay
      const currentDelay = vehicleJob.opts.delay || 0;
      const additionalDelay = 2 * 60 * 1000; // 2 minutes in milliseconds
      const newDelay = currentDelay + additionalDelay;
  
      // Update the job's delay
      await vehicleJob.changeDelay(newDelay);
  
      // Calculate the new run time
      const currentTime = Date.now();
      const newRunTime = new Date(currentTime + newDelay);
  
      console.log(`Vehicle ID ${bidVehicleId} delay extended by 2 minutes. New run time: ${newRunTime.toLocaleTimeString()}`);
  
      return result;
    } catch (error) {
      console.error('Error placing bid:', error.message);
      throw new Error('Failed to place bid');
    } finally {
      // Release the lock
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

    console.log(`Found ${jobs.length} jobs in the waiting or delayed state.`);
    const now = new Date();
    console.log('Current time:', now.toISOString());

    const vehiclesWithInsertionTime = [];
    jobs.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

    for (const job of jobs) {
      const jobState = await job.getState();
      if (!jobState) {
        console.log(`Job with ID ${job.id} does not have a state.`);
        continue;
      }

      console.log('Job data:', job.data); // Log full job data

      if (!job.data || !job.data.vehicle) {
        console.log(`Job with ID ${job.id} does not have vehicle data.`);
        continue;
      }

      const data = job.data.vehicle;
      const insertionTime = new Date(job.timestamp);

      if (jobState === 'delayed') {
        console.log(`Vehicle ID ${data.id} inserted at: ${insertionTime.toISOString()}`);
        vehiclesWithInsertionTime.push({
          vehicle: data,
          insertionTime,
        });
      }
    }

    if (vehiclesWithInsertionTime.length === 0) {
      console.log('No vehicles to activate.');
      return [];
    }

    vehiclesWithInsertionTime.sort((a, b) => a.insertionTime.getTime() - b.insertionTime.getTime());

    const displayDuration = 5 * 60 * 1000;
    const startTime = vehiclesWithInsertionTime[0].insertionTime || now;
    const elapsed = now.getTime() - startTime.getTime();
    const vehicleIndex = Math.floor(elapsed / displayDuration);

    if (vehicleIndex >= vehiclesWithInsertionTime.length) {
      console.log('No vehicle is ready to be activated at this time.');
      return [];
    }

    const vehicleToActivate = vehiclesWithInsertionTime[vehicleIndex];
    console.log('Activating Vehicle:', vehicleToActivate.vehicle);

    return [{
      ...vehicleToActivate.vehicle,
      bidStartTime: new Date(vehicleToActivate.vehicle.bidStartTime),
      bidTimeExpire: new Date(vehicleToActivate.vehicle.bidTimeExpire),
      createdAt: new Date(vehicleToActivate.vehicle.createdAt),
      updatedAt: new Date(vehicleToActivate.vehicle.updatedAt),
      dateOfRegistration: new Date(vehicleToActivate.vehicle.dateOfRegistration),
    }];
  } catch (error) {
    console.error('Error retrieving jobs from the queue:', error);
    return [];
  }
}


    
}

  
  



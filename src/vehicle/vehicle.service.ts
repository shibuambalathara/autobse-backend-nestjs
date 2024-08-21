import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVehicleInput } from './dto/create-vehicle.input';
import { UpdateVehicleInput } from './dto/update-vehicle.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Bid, Prisma, Vehicle } from '@prisma/client';
import { VehicleWhereUniqueInput } from './dto/unique-vehicle.input';
import { InjectQueue } from '@nestjs/bullmq';
import { Job, Queue,Worker } from 'bullmq';
import { RedisOptions } from 'ioredis';
import { CreateBidInput } from 'src/bid/dto/create-bid.input';


@Injectable()
export class VehicleService {
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
      
      if (event.eventCategory === 'offline') 
        {
        await this.vehicleBidQueue.add('process-vehicle', {
          vehicle,
        }, {
          delay: Math.max(new Date(vehicle.bidTimeExpire).getTime() - Date.now(), 0),
        });
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



  async listVehicleFromQueue(): Promise<Vehicle[] | null> {
    try {
      const jobs = await this.vehicleBidQueue.getJobs(['waiting'], 1);
      if (!jobs || jobs.length === 0) {
        console.log('No jobs found in the waiting state.');
        return [];
      }
  
      const vehicles = await Promise.all(
        jobs.map(async job => {
          const latestJob = await this.vehicleBidQueue.getJob(job.id); // Fetch the latest job data
          if (!latestJob) {
            return null; // Handle case where job might have been removed or is unavailable
          }
          const data = latestJob.data.vehicle;
          console.log('Job data:', data);
          return {
            ...data,
            bidStartTime: new Date(data.bidStartTime),
            bidTimeExpire: new Date(data.bidTimeExpire),
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
            dateOfRegistration: new Date(data.dateOfRegistration),
          };
        })
      );
  
      return vehicles;
  }
    catch (error) {
      console.error('Error retrieving jobs from the queue:', error);
      return [];
    }
  }

  async placeBid( userId: string,bidVehicleId: string,createBidInput:CreateBidInput): Promise<Bid|null> {
    try {
      const result = await this.prisma.bid.create({
        data: {
          ...createBidInput,
          userId:userId,
          bidVehicleId:bidVehicleId
        }
      });
      const additionalTime = 2 * 60 * 1000; // 2 minutes
      await this.updateVehicleExpireTime(bidVehicleId, additionalTime);
      console.log('Creating bid with:', { userId, bidVehicleId, createBidInput });

      return result;
      
    }
    catch (error) {
      throw new Error(error.message)  
    }
  }

  async updateVehicleExpireTime(bidVehicleId: string, additionalTime: number): Promise<void> {
    const job: Job = await this.vehicleBidQueue.getJob(bidVehicleId);
  
    if (job) {
      const currentExpireTime = new Date(job.data.bidTimeExpire).getTime();
      const newExpireTime = new Date(currentExpireTime + additionalTime).toISOString();
  
      const updatedData = {
        ...job.data,
        bidTimeExpire: newExpireTime,
      };
  
      await job.updateData(updatedData);
      const updatedJob = await this.vehicleBidQueue.getJob(bidVehicleId);
      console.log('Updated job data:', updatedJob?.data);
      console.log(`Updated bidTimeExpire for vehicle ${bidVehicleId} to ${newExpireTime}`);
    } else {
      console.error(`Job with vehicleId ${bidVehicleId} not found.`);
    }
  }
  
//   async handleBid(vehicleId: string) {
//   const vehicleJob = await this.vehicleBidQueue.getJob(vehicleId);
//   if (vehicleJob) {
//     const currentTime = Date.now();
//     const expireTime = new Date(vehicleJob.data.expireTime).getTime();

//     if (currentTime < expireTime) {
//       // Extend expire time by 2 minutes
//       const newExpireTime = expireTime + 2 * 60 * 1000;
//       vehicleJob.data.expireTime = new Date(newExpireTime).toISOString();

//       // Update delay for the vehicle in the queue
//       const remainingTime = newExpireTime - currentTime;
//       vehicleJob.moveToDelayed(remainingTime);
//     }
//   }
// }


//  const showNextVehicle = async () => {
//   const jobs = await this.vehicleBidQueue.getJobs('waiting');
//   if (jobs.length > 0) {
//     const nextVehicle = jobs[0]; // The next vehicle in the queue
//     // Process or display this next vehicle
//   }
// };
// const scheduleNextVehicle = async () => {
//   const currentVehicle = await this.getCurrentVehicle();
//   if (currentVehicle) {
//     const remainingTime = new Date(currentVehicle.endTime).getTime() - Date.now();
//     setTimeout(async () => {
//       await showNextVehicle();
//     }, remainingTime);
//   }
// };
}

  
  



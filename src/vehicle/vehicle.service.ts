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
        const vehicleDealyTime = event.vehicleLiveTimeIn;
    
        // Calculate the delay based on the event start time and the number of vehicles already in the queue
        const delay = Math.max(eventStartTime - Date.now(), 0) + currentVehicleCount * vehicleDealyTime * 60 * 1000; // 5 minutes per vehicle
        const extraTimeDelay = event.extraTime
        console.log("extra",extraTimeDelay)
        await this.vehicleBidQueue.add(vehicle.id, { vehicle, extraTimeDelay}, { delay });
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

//   async placeBid(userId: string, bidVehicleId: string, createBidInput: CreateBidInput): Promise<Bid | null> {
//     try {
        
//         const result = await this.prisma.bid.create({
//             data: {
//                 ...createBidInput,
//                 userId: userId,
//                 bidVehicleId: bidVehicleId,
//             },
//         });

        
//         const jobs = await this.vehicleBidQueue.getJobs(['waiting', 'delayed']);
//         const vehicleJob = jobs.find((job) => job.data?.vehicle?.id === bidVehicleId);

//         if (!vehicleJob) {
//             console.log(`Vehicle Job with ID ${bidVehicleId} not found.`);
//             return result;
//         }

        
//         const vehicleEvent = await this.prisma.event.findUnique({
//             where: { id: vehicleJob.data.vehicle.eventId },
//         });

//         if (!vehicleEvent) {
//             console.log(`Event not found for Vehicle ID ${bidVehicleId}.`);
//             return result;
//         }

//         const originalVehicleLiveTimeIn = vehicleEvent.vehicleLiveTimeIn || 0;
//         const delayIncrementMinutes = vehicleEvent.extraTime || 0;
//         const delayIncrementMs = delayIncrementMinutes * 60 * 1000;

       
//         const startTimeDate = new Date(vehicleJob.data.vehicle.bidStartTime);
//         const currentEndTime = vehicleJob.data.vehicle.nextRunTime
//             ? new Date(vehicleJob.data.vehicle.nextRunTime)
//             : new Date(startTimeDate.getTime() + originalVehicleLiveTimeIn * 60 * 1000);

//         const newEndTime = new Date(currentEndTime.getTime() + delayIncrementMs);

        
//         await vehicleJob.updateData({
//             vehicle: {
//                 ...vehicleJob.data.vehicle,
//                 nextRunTime: newEndTime.toISOString(),
//                 vehicleLiveTimeIn: originalVehicleLiveTimeIn, 
//                 currentLiveTimeExtension: (vehicleJob.data.vehicle.currentLiveTimeExtension || 0) + delayIncrementMinutes,
//             },
//         });

       
//         await vehicleJob.changeDelay(newEndTime.getTime());
//         console.log(`Job delay incremented by ${delayIncrementMs}ms. New end time: ${newEndTime.toLocaleTimeString()}.`);


//         const isBidCompleted = newEndTime.getTime() <= new Date().getTime(); 

//         if (isBidCompleted) {
//             console.log(`Bidding completed for vehicle ID ${bidVehicleId}.`);

            
//             await vehicleJob.updateData({
//                 vehicle: {
//                     ...vehicleJob.data.vehicle,
//                     currentLiveTimeExtension: 0, 
//                 },
//             });

//             console.log(`Vehicle ID ${bidVehicleId} live time reset to original value.`);

           
//             const nextVehicleJob = jobs.find((job) =>
//                 job.data?.vehicle?.id !== bidVehicleId &&
//                 new Date(job.data?.vehicle?.bidStartTime) > newEndTime
//             );

//             if (nextVehicleJob) {
//                 const nextVehicleStartTime = newEndTime;

//                 await nextVehicleJob.updateData({
//                     vehicle: {
//                         ...nextVehicleJob.data.vehicle,
//                         bidStartTime: nextVehicleStartTime.toISOString(),
//                         nextRunTime: nextVehicleStartTime.toISOString(),
//                     },
//                 });

//                 console.log(`Next vehicle job updated. New start time: ${nextVehicleStartTime.toLocaleTimeString()}.`);
//             }
//         }

//         return result;
//     } catch (error) {
//         console.error('Error placing bid:', error.message);
//         throw new Error('Failed to place bid');
//     }
// }

async placeBid(userId: string, bidVehicleId: string, createBidInput: CreateBidInput): Promise<Bid | null> {
  try {
   
      const result = await this.prisma.bid.create({
          data: {
              ...createBidInput,
              userId: userId,
              bidVehicleId: bidVehicleId,
          },
      });

      
      const jobs = await this.vehicleBidQueue.getJobs(['waiting', 'delayed']);
      
      
      const vehicleJob = jobs.find((job) => job.data?.vehicle?.id === bidVehicleId);
      
      if (!vehicleJob) {
          console.log(`Vehicle Job with ID ${bidVehicleId} not found.`);
          return result;
      }

      
      const vehicleEvent = await this.prisma.event.findUnique({
          where: { id: vehicleJob.data.vehicle.eventId },
      });

      if (!vehicleEvent) {
          console.log(`Event not found for Vehicle ID ${bidVehicleId}.`);
          return result;
      }

      const originalVehicleLiveTimeIn = vehicleEvent.vehicleLiveTimeIn || 0; 
      const delayIncrementMinutes = vehicleEvent.extraTime || 0; 
      const delayIncrementMs = delayIncrementMinutes * 60 * 1000; 

      const startTimeDate = new Date(vehicleJob.data.vehicle.bidStartTime);
      
    
      const currentEndTime = vehicleJob.data.vehicle.nextRunTime
          ? new Date(vehicleJob.data.vehicle.nextRunTime)
          : new Date(startTimeDate.getTime() + originalVehicleLiveTimeIn * 60 * 1000); 

      const newEndTime = new Date(currentEndTime.getTime() + delayIncrementMs);

   
      await vehicleJob.updateData({
          vehicle: {
              ...vehicleJob.data.vehicle,
              nextRunTime: newEndTime.toISOString(), 
              vehicleLiveTimeIn: originalVehicleLiveTimeIn, 
              currentLiveTimeExtension: (vehicleJob.data.vehicle.currentLiveTimeExtension || 0) + delayIncrementMinutes, 
          },
      });

      await vehicleJob.changeDelay(newEndTime.getTime());
      console.log(`Job delay incremented by ${delayIncrementMs}ms. New end time: ${newEndTime.toLocaleTimeString()}.`);

     
      const isBidCompleted = newEndTime.getTime() <= new Date().getTime(); 

      if (isBidCompleted) {
          console.log(`Bidding completed for vehicle ID ${bidVehicleId}.`);

          
          await vehicleJob.updateData({
              vehicle: {
                  ...vehicleJob.data.vehicle,
                  currentLiveTimeExtension: 0, 
              },
          });

          console.log(`Vehicle ID ${bidVehicleId} live time reset to original value.`);
      }

  
      const nextVehicleJob = jobs.find((job) =>
          job.data?.vehicle?.id !== bidVehicleId &&
          new Date(job.data?.vehicle?.bidStartTime) > new Date() 
      );

      if (nextVehicleJob) {
          const nextVehicleStartTime = nextVehicleJob.data.vehicle.nextRunTime
              ? new Date(nextVehicleJob.data.vehicle.nextRunTime)
              : new Date(nextVehicleJob.data.vehicle.bidStartTime); 
          console.log(`Next vehicle job detected. Start time: ${nextVehicleStartTime.toLocaleTimeString()}.`);

          
          await nextVehicleJob.updateData({
              vehicle: {
                  ...nextVehicleJob.data.vehicle,
                  nextRunTime: nextVehicleStartTime.toISOString(),
                  currentLiveTimeExtension: 0, 
              },
          });

         
          await nextVehicleJob.changeDelay(nextVehicleStartTime.getTime());
          console.log(`Next vehicle job updated. New start time: ${nextVehicleStartTime.toLocaleTimeString()}.`);
      }

      return result;
  } catch (error) {
      console.error('Error placing bid:', error.message);
      throw new Error('Failed to place bid');
  }
}


async listVehicleFromQueue(): Promise<Vehicle[] | null> {
  try {
      const jobs = await this.vehicleBidQueue.getJobs(['waiting', 'delayed']);

      if (!jobs || jobs.length === 0) {
          console.log('No jobs found in the waiting or delayed state.');
          return [];
      }

      const now = new Date();
      const vehiclesWithBidStartTime = [];

   
      jobs.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

      for (const job of jobs) {
          const jobState = await job.getState();
          if (!jobState || !job.data || !job.data.vehicle) continue;

          const vehicleData = job.data.vehicle;
          const bidStartTime = new Date(vehicleData.bidStartTime);

          
          const event = await this.prisma.event.findUnique({
              where: { id: vehicleData.eventId },
          });

          if (!event) {
              console.log(`Event not found for Vehicle ID ${vehicleData.id}.`);
              continue;
          }

         
          let displayDuration = (event.vehicleLiveTimeIn || 0) * 60 * 1000; 
          
          if (vehicleData.currentLiveTimeExtension && vehicleData.currentLiveTimeExtension > 0) {
              displayDuration += vehicleData.currentLiveTimeExtension * 60 * 1000;
          }

         
          if (jobState === 'delayed' && now >= bidStartTime) {
              vehiclesWithBidStartTime.push({
                  vehicle: vehicleData,
                  bidStartTime,
                  displayDuration,
              });
          }
      }

      if (vehiclesWithBidStartTime.length === 0) {
          return [];
      }

      vehiclesWithBidStartTime.sort((a, b) => a.bidStartTime.getTime() - b.bidStartTime.getTime());

      const startTime = vehiclesWithBidStartTime[0].bidStartTime || now;
      const elapsed = now.getTime() - startTime.getTime();

    
      let accumulatedTime = 0;
      for (const { vehicle, displayDuration } of vehiclesWithBidStartTime) {
          accumulatedTime += displayDuration;
          if (elapsed <= accumulatedTime) {
              return [{
                  ...vehicle,
                  bidStartTime: new Date(vehicle.bidStartTime),
                  bidTimeExpire: new Date(vehicle.bidTimeExpire),
                  createdAt: new Date(vehicle.createdAt),
                  updatedAt: new Date(vehicle.updatedAt),
                  dateOfRegistration: new Date(vehicle.dateOfRegistration),
              }];
          }
      }

 
      console.log('No vehicle is ready to be activated at this time.');
      return [];
  } catch (error) {
      console.error('Error retrieving jobs from the queue:', error);
      return [];
  }
}


    
}

  




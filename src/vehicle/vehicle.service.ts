import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVehicleInput } from './dto/create-vehicle.input';
import { UpdateVehicleInput } from './dto/update-vehicle.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Vehicle } from '@prisma/client';
import { VehicleWhereUniqueInput } from './dto/unique-vehicle.input';
import { VehicleListResponse } from './models/vehicleListModel';
// import { InjectQueue } from '@nestjs/bullmq';
// import { Queue } from 'bullmq';

@Injectable()
export class VehicleService {
  constructor(private readonly prisma:PrismaService,
    // @InjectQueue('vehicle-bid') private readonly vehicleBidQueue: Queue
  ){}
  

  async createVehicle(id: string,eventId: string,createVehicleInput: CreateVehicleInput): Promise<Vehicle | null> {
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
      
      return await this.prisma.vehicle.create({
        data: {
          ...createVehicleInput,
          // currentBidUserId: userId,
          eventId: eventId,
          createdById: id,
          bidStartTime: bidStartTime,
          bidTimeExpire: bidTimeExpire,
        },
      });

    } 
    catch(error){
              throw new Error(error.message)
           }
    }

  async vehicles(): Promise<VehicleListResponse | null>{
    const vehicles = await this.prisma.vehicle.findMany({where:{isDeleted:false}});
    const vehiclesCount = await this.prisma.vehicle.count({
      where: { isDeleted: false }
    });
    if(!vehicles) throw new NotFoundException("Vehicle Not Found");
    return {vehicles,vehiclesCount};
  }

  async vehicle(where:VehicleWhereUniqueInput) : Promise<Vehicle | null> {
    const vehicle = await this.prisma.vehicle.findUnique({where:
      {...where as Prisma.VehicleWhereUniqueInput,isDeleted:false

      }
    ,include:{event:true,userVehicleBids:true,currentBidUser:true}
  });
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

async countVehicles():Promise<number|0>{
  const vehicleCount=await this.prisma.vehicle.count({where:{isDeleted:false}})
  return vehicleCount
}
 
  }


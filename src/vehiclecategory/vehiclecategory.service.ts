import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVehiclecategoryInput } from './dto/create-vehiclecategory.input';
import { UpdateVehiclecategoryInput } from './dto/update-vehiclecategory.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, VehicleCategory } from '@prisma/client';
import { VehicleCategoryWhereUniqueInput } from './dto/unique-vehiclecategory.input';


@Injectable()
export class VehiclecategoryService {
  constructor(private readonly prisma:PrismaService){}
  
  async createVehicleCategory(userId:string,createVehiclecategoryInput: CreateVehiclecategoryInput):Promise<VehicleCategory|null> {
    try{
      return await this.prisma.vehicleCategory.create({
        data:{
          createdById:userId,
          ...createVehiclecategoryInput,
        }
      })
    }
    catch(error){
      throw new Error(error.message);
    }
  }

  async vehicleCategories() : Promise<VehicleCategory [] | null> {
    const result = await this.prisma.vehicleCategory.findMany({where:{isDeleted:false}});
    if(!result) throw new NotFoundException("VehicleCategory Not found");
    return result;
  }

  async vehicleCategory(where:VehicleCategoryWhereUniqueInput): Promise<VehicleCategory|null> {
    const result = await this.prisma.vehicleCategory.findUnique({where:{...where as Prisma.VehicleCategoryWhereUniqueInput,isDeleted:false}});
    if(!result) throw new NotFoundException("VehicleCategory Not Found");
    return result;
  }

  async updateVehicleCategory(id:string,updateVehiclecategoryInput: UpdateVehiclecategoryInput):Promise<VehicleCategory|null> {
    try{
      return await this.prisma.vehicleCategory.update({where:{id,isDeleted:false},
      data:{
        ...updateVehiclecategoryInput,
      }});
    }
    catch(error){
      throw new Error(error.message);
    }
  }

  async deleteVehicleCategory(id: string):Promise<VehicleCategory|null> {
    const result = await this.prisma.vehicleCategory.update({where:{id,isDeleted:false},
      data:{
        isDeleted:true,
      }
    });
    if(!result) throw new NotFoundException("VehicleCategory not found");
    return result;
  }

  async deletedVehicleCategories() : Promise<VehicleCategory[] | null>{
    const result = await this.prisma.vehicleCategory.findMany({where:{isDeleted:true}});
    if(!result) throw new NotFoundException("VehicleCategory Not Found");
    return result;
  }

  async deletedVehicleCategory(id:string) : Promise<VehicleCategory | null>{
    const result =  await this.prisma.vehicleCategory.findUnique({where:{id,isDeleted:true}});
    if(!result) throw new NotFoundException("VehicleCategory Not Found")
    return result;
  }

  async restoreVehicleCategory(id:string):Promise<VehicleCategory|null>{
    const vehicle = await this.prisma.vehicleCategory.findUnique({where:{id,isDeleted:true}});
    if(!vehicle) throw new NotFoundException("vehicleCategory Not Found");
    return await this.prisma.vehicleCategory.update({
      where:{id},
      data:{
        isDeleted:false,
      }
    });
  }

  }

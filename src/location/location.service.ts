import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLocationInput } from './dto/create-location.input';
import { UpdateLocationInput } from './dto/update-location.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Location } from '@prisma/client';

@Injectable()
export class LocationService {
  constructor(private readonly prisma:PrismaService){}
  
  async createLocation(stateId:string,createLocationInput: CreateLocationInput): Promise<Location> {
   try{
    return await this.prisma.location.create({
      data:{
        stateId:stateId,
        name:createLocationInput.name
      }
    });
    }
   catch(error){
    throw new Error(error.message)
      }
  }

  async locations(): Promise<Location[] | null> {
    const result =  await this.prisma.location.findMany({where:{isDeleted:false}});
    if(!result) throw new NotFoundException("Location Not Found!");    
    return result;
    
  }

  async location(id: string) : Promise<Location | null> {
    const result = await this.prisma.location.findUnique({where:{id,isDeleted:false}});
    if(!result) throw new NotFoundException("Location not found")
    return result;
  }

  async updateLocation(id: string, updateLocationInput: UpdateLocationInput) : Promise<Location>{
    try {
      const state = await this.prisma.location.findUnique({where:{id,isDeleted:false,}})
      if(!state) throw new NotFoundException("Location Not Found");
      return await this.prisma.location.update({
          where:{
            id,
          },
          data:{
            ...updateLocationInput,
          }
        });
      }
  catch (error) {
        if (error instanceof NotFoundException) {
          throw new Error(error.message); 
          }
        }
    }
  

  async deleteLocation(id: string) :Promise<Location> {
    const result = await this.prisma.location.findUnique({where:{id,isDeleted:false,}})
    if(!result) throw new NotFoundException("Location Not Found");
    return await this.prisma.location.update({
        where:{id},
        data:{
          isDeleted:true,
        }
      });
    }
  
  async deletedLocations() : Promise<Location[] | null>{
      const result = await this.prisma.location.findMany({where:{isDeleted:true,}});
      if(!result) throw new NotFoundException("Location Not Found");
      return result;
    }
  
  async deletedLocation(id:string) : Promise<Location | null>{
    const result = await this.prisma.location.findUnique({where:{id,isDeleted:true}});
    if(!result) throw new NotFoundException("Location Not Found");
    return result;
  }

  
}

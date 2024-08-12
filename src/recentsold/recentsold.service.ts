import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRecentsoldInput } from './dto/create-recentsold.input';
import { UpdateRecentsoldInput } from './dto/update-recentsold.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { RecentSold } from '@prisma/client';

@Injectable()
export class RecentsoldService {
  constructor(private readonly prisma:PrismaService){}

  async createRecentsold(createRecentsoldInput: CreateRecentsoldInput):Promise<RecentSold|null> {
    try{
    return await this.prisma.recentSold.create({
      data:{
        ...CreateRecentsoldInput,
      }
    })
   }
    catch(error){
      throw new Error(error.message)
        }
  }

  async recentSolds():Promise<RecentSold[]|null>{
    const result =  await this.prisma.recentSold.findMany({where:{isDeleted:false}});
    if(!result) throw new NotFoundException("Recent Sold Not Found!");    
    return result;
  }


  async updateRecentsold(id:string,updateRecentsoldInput: UpdateRecentsoldInput):Promise<RecentSold|null> {
    try {
      const result = await this.prisma.recentSold.findUnique({where:{id,isDeleted:false,}})
      if(!result) throw new NotFoundException("RecentSold Not Found");
      return await this.prisma.recentSold.update({
          where:{
            id,
          },
          data:{
            ...UpdateRecentsoldInput,
          }
        });
      }
  catch (error) {
        if (error instanceof NotFoundException) {
          throw new Error(error.message); 
          }
        }
    }

  async deleteRecentsold(id: string) {
    const result = await this.prisma.recentSold.findUnique({where:{id,isDeleted:false,}})
    if(!result) throw new NotFoundException("RecentSold Not Found");
    return await this.prisma.location.update({
        where:{id},
        data:{
          isDeleted:true,
        }
      });
    }
}

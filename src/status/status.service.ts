import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStatusInput } from './dto/create-status.input';
import { UpdateStatusInput } from './dto/update-status.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Status } from '@prisma/client';
import { StatusWhereUniqueInput } from './dto/unique-status.input';

@Injectable()
export class StatusService {
  constructor(private readonly prisma:PrismaService){}

  async createStatus(id,createStatusInput: CreateStatusInput):Promise<Status|null> {
    try{
    return await this.prisma.status.create({
      data:{
        createdById:id,
        ...createStatusInput,
      }
    })
  }
  catch(error){
    throw new Error(error.message)
      }
  }

  async statuses():Promise<Status[]|null> {
    const status =await this.prisma.status.findMany({where:{isDeleted:false}});
    if(!status) throw new NotFoundException("Status Not Found");
    return status;
  }

  async status(where:StatusWhereUniqueInput):Promise<Status|null> {
    const status = await this.prisma.status.findUnique({where:{...where as Prisma.StatusWhereUniqueInput,isDeleted:false}})
    if(!status) throw new NotFoundException("Status Not Found");
    return status;
  }

  async updateStatus(id:string,updateStatusInput: UpdateStatusInput):Promise<Status|null> {
    try {
      const status = await this.prisma.status.findUnique({where:{id,isDeleted:false,}})
      if(!status) throw new NotFoundException("Status Not Found");
      return await this.prisma.status.update({
          where:{
            id,
          },
          data:{
            ...updateStatusInput,
          }
        });
      }
  catch (error) {
        if (error instanceof NotFoundException) {
          throw new Error(error.message); 
          }
        }
    }
  

  async deleteStatus(id: string):Promise<Status|null> {
    const status = await this.prisma.status.findUnique({where:{id,isDeleted:false,}})
    if(!status) throw new NotFoundException("Status Not Found");
    return await this.prisma.status.update({
        where:{id},
        data:{
          isDeleted:true,
        }
      });
    }

  async deletedStatuses():Promise<Status[]|null>{
      const status = await this.prisma.status.findMany({where:{isDeleted:true,}});
      if(!status) throw new NotFoundException("Status Not Found");
      return status;
  }

  async deletedStatus(id:string):Promise<Status|null>{
    const status = await this.prisma.status.findUnique({where:{id,isDeleted:true,}});
      if(!status) throw new NotFoundException("Status Not Found");
      return status;
  }

  async restoreStatus(where:StatusWhereUniqueInput):Promise<Status|null>{
    const status = await this.prisma.status.findUnique({where:{...(where as Prisma.StatusWhereUniqueInput),isDeleted:true}});
    if(!status) throw new NotFoundException("Status Not Found");
    return await this.prisma.status.update({
      where:{...where as Prisma.StatusWhereUniqueInput},
      data:{
        isDeleted:false,
      }
    });
  }

}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventWhereUniqueInput } from './dto/unique-event.input';
import { Prisma } from '@prisma/client';
import { Args } from '@nestjs/graphql';

@Injectable()
export class EventService {
  constructor(private readonly prisma:PrismaService){}

  async createEvent(createEventInput: CreateEventInput) {
    return await this.prisma.event.create({
      data:{
        ...createEventInput,
      }
    });
  }

  async events() {
    const result =  await this.prisma.event.findMany({where:{isDeleted:false}});
    if(!result) throw new NotFoundException("Event Not Found!");    
    return result;
  }

  async event(@Args('where') where:EventWhereUniqueInput) {
    const result = await this.prisma.event.findUnique({where:{...where as Prisma.EventWhereUniqueInput,isDeleted:false}});
    if(!result) throw new NotFoundException("Event not found")
    return result;
  }

  async updateEvent( id:string,updateEventInput: UpdateEventInput) {
    try {
      const event = await this.prisma.event.findUnique({where:{id,isDeleted:false,}})
      if(!event) throw new NotFoundException("Event Not Found");
      return await this.prisma.event.update({
          where:{
            id,
          },
          data:{
            ...updateEventInput,
          }
        });
      }
  catch (error) {
        if (error instanceof NotFoundException) {
          throw new Error(error.message); 
          }
        }
    }

  async deleteEvent(id: string) {
    const event = await this.prisma.event.findUnique({where:{id,isDeleted:false,}})
    if(!event) throw new NotFoundException("Location Not Found");
    return await this.prisma.event.update({
        where:{id},
        data:{
          isDeleted:true,
        }
      });
    }

  async deletedEvents(){
      const event = await this.prisma.event.findMany({where:{isDeleted:true,}});
      if(!event) throw new NotFoundException("Event Not Found");
      return event;
    }
  
  async deletedEvent(id:string){
      const result = await this.prisma.event.findUnique({where:{id,isDeleted:true}});
      if(!result) throw new NotFoundException("Event Not Found");
      return result;
    }
  
  async restoreEvent(where:EventWhereUniqueInput){
      const event = await this.prisma.event.findUnique({where:{...(where as Prisma.EventWhereUniqueInput),isDeleted:true}});
      if(!event) throw new NotFoundException("Event Not Found");
      return await this.prisma.event.update({
        where:{...where as Prisma.EventWhereUniqueInput},
        data:{
          isDeleted:false,
        }
      });
    }
  }


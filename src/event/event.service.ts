import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventWhereUniqueInput } from './dto/unique-event.input';
import { Prisma } from '@prisma/client';
import { Args } from '@nestjs/graphql';
import { Event } from './models/event.model';


@Injectable()
export class EventService {
  constructor(private readonly prisma:PrismaService){}

  async createEvent(sellerId:string,vehicleCategoryId:string,locationId:string,id:string,createEventInput: CreateEventInput) :Promise<Event|null>{
    try{
    return await this.prisma.event.create({
      data:{

        sellerId:sellerId,
        vehicleCategoryId:vehicleCategoryId,
        locationId:locationId,
        createdById:id,
        ...createEventInput,
      }
    });
  }
    catch (error) {
      console.error("Error creating event:", error);
      throw new Error("Event creation failed.");
    }
  }

  async events() : Promise<Event[]|null>{
    const result =  await this.prisma.event.findMany({where:{isDeleted:false}});  
    if(!result) throw new NotFoundException("Event Not Found!");    
    return result;
  }

  async event(@Args('where') where:EventWhereUniqueInput):Promise<Event|null> {
    const result = await this.prisma.event.findUnique({where:{...where as Prisma.EventWhereUniqueInput,isDeleted:false}});
    if(!result) throw new NotFoundException("Event not found")
    return result;
  }

  async updateEvent( id:string,updateEventInput: UpdateEventInput):Promise<Event|null> {
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

  async deleteEvent(id: string):Promise<Event|null> {
    const event = await this.prisma.event.findUnique({where:{id,isDeleted:false,}})
    if(!event) throw new NotFoundException("Location Not Found");
    return await this.prisma.event.update({
        where:{id},
        data:{
          isDeleted:true,
        }
      });
    }

  async deletedEvents():Promise<Event[]|null>{
      const event = await this.prisma.event.findMany({where:{isDeleted:true,}});
      if(!event) throw new NotFoundException("Event Not Found");
      return event;
    }
  
  async deletedEvent(id:string):Promise<Event|null>{
      const result = await this.prisma.event.findUnique({where:{id,isDeleted:true}});
      if(!result) throw new NotFoundException("Event Not Found");
      return result;
    }
  
  async restoreEvent(where:EventWhereUniqueInput):Promise<Event|null>{
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


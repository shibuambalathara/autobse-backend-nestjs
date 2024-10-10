import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventWhereUniqueInput } from './dto/unique-event.input';
import { Prisma } from '@prisma/client';
import { Args, Int } from '@nestjs/graphql';
import { Event } from './models/event.model';
import { EventOrderByInput } from './dto/EventOrderByInput';
import { Vehicle } from 'src/vehicle/models/vehicle.model';
import { VehicleOrderByInput } from 'src/vehicle/dto/vehicleOrderByInput';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  async createEvent(
    sellerId: string,
    vehicleCategoryId: string,
    locationId: string,
    id: string,
    createEventInput: CreateEventInput,
  ): Promise<Event | null> {
    try {
      return await this.prisma.event.create({
        data: {
          sellerId: sellerId,
          vehicleCategoryId: vehicleCategoryId,
          locationId: locationId,
          createdById: id,
          firstVehicleEndDate:createEventInput?.endDate,  // currently setting based on online events only
          ...createEventInput,
        },
        include: {
          vehicles: true,
          seller:true,
          location:true,
          vehicleCategory:true
        },
      });
    } catch (error) {
      console.error('Error creating event:', error);
      throw new Error('Event creation failed.');
    }
  }

  async events(
    @Args('where') where?: EventWhereUniqueInput,
    @Args('orderBy', { type: () => [EventOrderByInput], nullable: true })
    orderBy?: EventOrderByInput[],
    @Args('take', { type: () => Int, nullable: true }) take?: number,
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
  ): Promise<Event[] | null> {
    const events = await this.prisma.event.findMany({
      where: {
        isDeleted: false,
        ...where,
      },
      orderBy,
      take,
      skip,

      include: {
        vehicles: true,
        seller:true,
        location:true,
        vehicleCategory:true
      },
    });
    if (!events) throw new NotFoundException('Events Not Found!');
    const eventWithVehicleCounts = await Promise.all(
      events.map(async (event) => {
        const vehiclesCount = await this.prisma.vehicle.count({
          where: { eventId: event.id, isDeleted: false },
        });
        return { ...event, vehiclesCount }; 
      })
    );
  
    return eventWithVehicleCounts;  
  
 
    
  }
  // -----------
  async getVehicles(
    eventId: string,
     orderBy?: VehicleOrderByInput[],
    take?: number,
    skip?: number
  ): Promise<Vehicle[]> {
    return this.prisma.vehicle.findMany({
      where: {
        eventId,
      },
       orderBy,
      take,
      skip,
    });
  }

  // -------------

  async event(
    @Args('where') where: EventWhereUniqueInput,
  ): Promise<Event | null> {
    const result = await this.prisma.event.findUnique({
      where: { ...(where as Prisma.EventWhereUniqueInput), isDeleted: false },
      include: {
        vehicles: true,
        seller:true,
        location:true,
        vehicleCategory:true
      },
    });
    const vehiclesCount=await this.prisma.vehicle.count({where:{eventId:where?.id,isDeleted:false,}})
    if (!result) throw new NotFoundException('Event not found');
    return {...result,vehiclesCount};
  }

  async updateEvent(
    id: string,
    updateEventInput: UpdateEventInput,
  ): Promise<Event | null> {
    try {
      const event = await this.prisma.event.findUnique({
        where: { id, isDeleted: false },
      });
      if (!event) throw new NotFoundException('Event Not Found');
      return await this.prisma.event.update({
        where: {
          id,
        },
        data: {
          ...updateEventInput,
        },
        include: {
          vehicles: true,
          seller:true,
          location:true,
          vehicleCategory:true
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new Error(error.message);
      }
    }
  }

  async deleteEvent(id: string): Promise<Event | null> {
    const event = await this.prisma.event.findUnique({
      where: { id, isDeleted: false },
    });
    if (!event) throw new NotFoundException('Location Not Found');
    return await this.prisma.event.update({
      where: { id },
      data: {
        isDeleted: true,
      },
      include: {
        vehicles: true,
        seller:true,
        location:true,
        vehicleCategory:true
      },
    });
  }

  async deletedEvents(): Promise<Event[] | null> {
    const event = await this.prisma.event.findMany({
      where: { isDeleted: true },
      include: {
        vehicles: true,
        seller:true,
        location:true,
        vehicleCategory:true
      },
    });
    if (!event) throw new NotFoundException('Event Not Found');
    return event;
  }

  async deletedEvent(id: string): Promise<Event | null> {
    const result = await this.prisma.event.findUnique({
      where: { id, isDeleted: true },
      include: {
        vehicles: true,
        seller:true,
        location:true,
        vehicleCategory:true
      },
    });
    if (!result) throw new NotFoundException('Event Not Found');
    return result;
  }

  async restoreEvent(where: EventWhereUniqueInput): Promise<Event | null> {
    const event = await this.prisma.event.findUnique({
      where: { ...(where as Prisma.EventWhereUniqueInput), isDeleted: true },
    });
    if (!event) throw new NotFoundException('Event Not Found');
    return await this.prisma.event.update({
      where: { ...(where as Prisma.EventWhereUniqueInput) },
      data: {
        isDeleted: false,
      },
      include: {
        vehicles: true,
        seller:true,
        location:true,
        vehicleCategory:true
      },
    });
  }
}

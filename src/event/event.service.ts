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
import { QueryOptionsType } from './queryOptions';

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

    const currentDate = new Date();
    const endDate = new Date(createEventInput?.endDate);

    if (endDate <= currentDate) {
      throw new Error('Event end date must be in the future.');
    }
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
    where?: EventWhereUniqueInput,
        orderBy?: EventOrderByInput[],
        take?: number,
        skip?: number,
        options?: QueryOptionsType 
  ): Promise<Event[] | null> {
    if (options?.enabled === false) {
      return []; 
  }
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
  const upcomingEventCount = await this.prisma.event.count({
      where: {
        isDeleted: false,
        startDate: { gt: new Date() },
        status: {
          equals: 'active',
        },
      },
    });
    const LiveEventCount = await this.prisma.event.count({
      where: {
        isDeleted: false,
        startDate: { lte: new Date()},
        status: {
          equals: "active",
        },
      }
    });
    const totalEventsCount = await this.prisma.event.count({
      where: {
        isDeleted: false, status: {
          equals: 'active',
        },
      }
    });
    const CompletedEventCount = await this.prisma.event.count({
      where: {
        isDeleted: false,
        endDate: { lt: new Date() },
          status: {
            equals: "active",
          },
      }
    });
    
    const resultEvents = eventWithVehicleCounts.map(event => ({
      ...event,
      upcomingEventCount,
      LiveEventCount,
      totalEventsCount,
      CompletedEventCount
    }));
  
    return resultEvents;  
 
    
    
  }
  // -----------
  async getVehicles(
    eventId: string,
    orderBy?: VehicleOrderByInput[],
    take?: number,
    skip?: number,
    userId?: string
  ): Promise<(Vehicle & { myBidRank?: number; totalBids: number })[]> {
    const vehicles = await this.prisma.vehicle.findMany({
      where: {
        eventId,
      },
      include: {
        userVehicleBids: {
          include: {
         user: true,
          },
          orderBy:{amount:'desc'}
        },
      },
      orderBy,
      take,
      skip,
    });
  
    const [findRank, totalBids] = await Promise.all([
      Promise.all(vehicles.map(async (vehicle) => {
        const rank = await this.prisma.bid.findMany({
          distinct: ["userId"],
          where: { bidVehicle: { id: { equals: vehicle?.id } } },
          orderBy: [
            { amount: "desc" },
            { createdAt: "asc" },
          ],
          skip: 0,
          take: 10,
        });
        return rank.findIndex((x) => x?.userId === userId) + 1; 
      })),
      Promise.all(vehicles.map(async (vehicle) => {
        return this.prisma.bid.count({
          where: {
            bidVehicleId: vehicle.id,
          },
        });
      })),
    ]);
  
    const vehiclesWithDetails = vehicles.map((vehicle, index) => ({
      ...vehicle,
      myBidRank: findRank[index], 
      totalBids: totalBids[index], 
    }));
  
    return vehiclesWithDetails; 
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

  async countEvents():Promise<number|0>{
    const eventsCount=await this.prisma.event.count({where:{isDeleted:false}})
    return eventsCount
  }
}

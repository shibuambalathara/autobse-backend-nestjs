import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventInput } from '../dto/create-event.input';
import { UpdateEventInput } from '../dto/update-event.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventWhereUniqueInput } from '../dto/unique-event.input';
import { Prisma } from '@prisma/client';
import { Args, Int } from '@nestjs/graphql';
import { Event } from '../models/event.model';
import { EventOrderByInput } from '../dto/EventOrderByInput';
import { Vehicle } from 'src/vehicle/models/vehicle.model';
import { VehicleOrderByInput } from 'src/vehicle/dto/vehicleOrderByInput';

@Injectable()
export class UpcomingEventService {
  constructor(private readonly prisma: PrismaService) {}

  async upcomingEvents(
    @Args('where') where?: EventWhereUniqueInput,
    @Args('orderBy', { type: () => [EventOrderByInput], nullable: true })
    orderBy?: EventOrderByInput[],
    @Args('take', { type: () => Int, nullable: true }) take?: number,
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
  ): Promise<Event[] | null> {
    const result = await this.prisma.event.findMany({
      where: {
        isDeleted: false,
        startDate: { gt: new Date().toISOString() },
            status: {
              equals: "active",
            },
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
    if (!result) throw new NotFoundException('Event Not Found!');
    return result;
    
  }
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

}
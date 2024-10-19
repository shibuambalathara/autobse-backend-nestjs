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
import { s3Service } from 'src/services/s3/s3.service';

@Injectable()
export class LiveEventService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: s3Service,
  ) { }

  async liveEvents(
    @Args('where') where?: EventWhereUniqueInput,
    @Args('orderBy', { type: () => [EventOrderByInput], nullable: true })
    orderBy?: EventOrderByInput[],
    @Args('take', { type: () => Int, nullable: true }) take?: number,
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
  ): Promise<Event[] | null> {
    const result = await this.prisma.event.findMany({
      where: {
        isDeleted: false,
        startDate: { lte: new Date().toISOString() },
        status: {
          equals: "active",
        },
        OR: [
          {
            endDate: { gte: new Date().toISOString() },
            // eventCategory: { equals: "open" },
          },
          {
            vehicles: {
              some: {
                bidTimeExpire: { gte: new Date().toISOString() },
              },
            },
          },
        ],
        ...where,
      },
      orderBy,
      take,
      skip,

      include: {
        vehicles: true,
        seller: true,
        location: true,
        vehicleCategory: true
      },
    });
    if (!result) throw new NotFoundException('Event Not Found!')
    for (const data of result) {
      if (data?.downloadableFile_filename) {
        const file = await this.s3Service.getUploadedExcelFile(data.downloadableFile_filename)
        data.downloadableFile_filename = file ? file : null
      }
    }
   const eventsWithCounts = await Promise.all(result.map(async (event) => {
   const vehicleCount = await this.prisma.vehicle.count({
      where: { eventId: event.id },  
    });

      return {
        ...event,
        vehiclesCount: vehicleCount,  
      };
    }));

    return eventsWithCounts;  
    

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
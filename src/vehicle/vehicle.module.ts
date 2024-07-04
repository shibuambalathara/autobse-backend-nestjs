import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleResolver } from './vehicle.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [VehicleResolver, VehicleService,PrismaService],
})
export class VehicleModule {}

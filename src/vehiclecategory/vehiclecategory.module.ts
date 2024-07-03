import { Module } from '@nestjs/common';
import { VehiclecategoryService } from './vehiclecategory.service';
import { VehiclecategoryResolver } from './vehiclecategory.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [VehiclecategoryResolver, VehiclecategoryService,PrismaService],
})
export class VehiclecategoryModule {}

import { Module } from '@nestjs/common';
import { VehiclecategoryService } from './vehiclecategory.service';
import { VehiclecategoryResolver } from './vehiclecategory.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [VehiclecategoryResolver, VehiclecategoryService],
})
export class VehiclecategoryModule {}

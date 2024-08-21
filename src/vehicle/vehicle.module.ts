import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleResolver } from './vehicle.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { BullModule } from '@nestjs/bullmq';
import { VehicleQueueProcessor } from './vehicle.processor';
import { BidModule } from 'src/bid/bid.module';


@Module({
  imports: [
    BullModule.registerQueue({
      name: 'vehicle-bid',
    }),
    BidModule
  ],
  providers: [VehicleResolver, VehicleService,VehicleQueueProcessor,PrismaService],
  exports: [BullModule],
})
export class VehicleModule {}

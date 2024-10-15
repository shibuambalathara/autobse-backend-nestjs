import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleResolver } from './vehicle.resolver';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RedisService } from 'src/services/redis/redis.service';


@Module({
  // imports: [
  //   BullModule.registerQueue({
  //     name: 'vehicle-bid',
  //   }),
  // ],
  // providers: [VehicleResolver, VehicleService,PrismaService],
  // exports: [BullModule],
  imports: [PrismaModule],
  providers: [VehicleService, VehicleResolver, RedisService],
  exports: [VehicleService],
})
export class VehicleModule {}

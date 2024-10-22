import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleResolver } from './vehicle.resolver';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RedisService } from 'src/services/redis/redis.service';
import { RedisModule } from 'src/services/redis/redis.module';


@Module({
  // imports: [
  //   BullModule.registerQueue({
  //     name: 'vehicle-bid',
  //   }),
  // ],
  // providers: [VehicleResolver, VehicleService,PrismaService],
  // exports: [BullModule],
  imports: [PrismaModule, RedisModule],
  providers: [VehicleService, VehicleResolver],
  exports: [VehicleService],
})
export class VehicleModule {}

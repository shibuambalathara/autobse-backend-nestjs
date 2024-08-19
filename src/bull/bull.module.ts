import { Module } from '@nestjs/common';
import { BullBoardService } from './bullboard.service'; 
import { BullModule } from '@nestjs/bullmq';
import { VehicleModule } from 'src/vehicle/vehicle.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
        password: 'redis',
      },
    }),
    VehicleModule
  ],
  providers: [BullBoardService],
  exports: [BullBoardService], 
})
export class BullBoardModule {}

import { Module } from '@nestjs/common';
import { LiveEventService } from './liveEvent.service';
import { LiveEventResolver } from './liveEvent.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { s3Service } from 'src/services/s3/s3.service';

@Module({
  providers: [LiveEventService, LiveEventResolver,PrismaService,s3Service],
})
export class LiveEventModule {}

import { Module } from '@nestjs/common';
import { LiveEventService } from './liveEvent.service';
import { LiveEventResolver } from './liveEvent.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [LiveEventService, LiveEventResolver,PrismaService],
})
export class LiveEventModule {}

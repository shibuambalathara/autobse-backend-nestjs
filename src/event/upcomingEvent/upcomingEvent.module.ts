import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpcomingEventService } from './upcomingEvents.service';
import { UpcomingEventResolver } from './upcomingEvents.resolver';

@Module({
  providers: [UpcomingEventService, UpcomingEventResolver,PrismaService],
})
export class UpcomingEventModule {}

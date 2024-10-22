import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpcomingEventService } from './upcomingEvents.service';
import { UpcomingEventResolver } from './upcomingEvents.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UpcomingEventService, UpcomingEventResolver],
})
export class UpcomingEventModule {}

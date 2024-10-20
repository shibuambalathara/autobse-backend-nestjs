import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventResolver } from './event.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { AcrService } from 'src/acr/acr.service';

@Module({
  providers: [EventResolver, EventService,PrismaService,AcrService],
})
export class EventModule {}

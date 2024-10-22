import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventResolver } from './event.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { AcrService } from 'src/acr/acr.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [EventResolver, EventService,AcrService],
})
export class EventModule {}

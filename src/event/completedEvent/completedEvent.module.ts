import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { s3Service } from 'src/services/s3/s3.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CompletedEventService } from './completedEvent.service';
import { CompletedEventResolver } from './completedEvent.resolver';

@Module({
  imports: [PrismaModule],
  providers: [CompletedEventService, CompletedEventResolver,s3Service],
})
export class CompletedEventModule {}

import { Module } from '@nestjs/common';
import { LiveEventService } from './liveEvent.service';
import { LiveEventResolver } from './liveEvent.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { s3Service } from 'src/services/s3/s3.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [LiveEventService, LiveEventResolver,s3Service],
})
export class LiveEventModule {}

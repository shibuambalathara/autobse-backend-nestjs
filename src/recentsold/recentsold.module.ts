import { Module } from '@nestjs/common';
import { RecentsoldService } from './recentsold.service';
import { RecentsoldResolver } from './recentsold.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [RecentsoldResolver, RecentsoldService,PrismaService],
})
export class RecentsoldModule {}

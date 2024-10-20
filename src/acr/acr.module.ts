import { Module } from '@nestjs/common';
import { AcrService } from './acr.service';
import { AcrResolver } from './acr.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [AcrResolver, AcrService,PrismaService],
})
export class AcrModule {}

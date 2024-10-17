import { Module } from '@nestjs/common';
import { EmdupdateService } from './emdupdate.service';
import { EmdupdateResolver } from './emdupdate.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [EmdupdateResolver, EmdupdateService,PrismaService],
})
export class EmdupdateModule {}

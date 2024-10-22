import { Module } from '@nestjs/common';
import { EmdupdateService } from './emdupdate.service';
import { EmdupdateResolver } from './emdupdate.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [EmdupdateResolver, EmdupdateService],
})
export class EmdupdateModule {}

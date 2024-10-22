import { Module } from '@nestjs/common';
import { AcrService } from './acr.service';
import { AcrResolver } from './acr.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AcrResolver, AcrService],
})
export class AcrModule {}

import { Module } from '@nestjs/common';
import { RecentsoldService } from './recentsold.service';
import { RecentsoldResolver } from './recentsold.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RecentsoldResolver, RecentsoldService],
})
export class RecentsoldModule {}

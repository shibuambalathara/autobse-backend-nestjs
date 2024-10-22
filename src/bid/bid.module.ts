import { Module } from '@nestjs/common';
import { BidService } from './bid.service';
import { BidResolver } from './bid.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/services/redis/redis.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [BidResolver, BidService, RedisService],
})
export class BidModule {}

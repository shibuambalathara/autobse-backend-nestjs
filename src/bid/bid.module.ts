import { Module } from '@nestjs/common';
import { BidService } from './bid.service';
import { BidResolver } from './bid.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/services/redis/redis.service';

@Module({
  providers: [BidResolver, BidService,PrismaService, RedisService],
})
export class BidModule {}

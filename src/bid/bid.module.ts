import { Module } from '@nestjs/common';
import { BidService } from './bid.service';
import { BidResolver } from './bid.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/services/redis/redis.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RedisModule } from 'src/services/redis/redis.module';

@Module({
  imports: [PrismaModule, RedisModule],
  providers: [BidResolver, BidService],
})
export class BidModule {}

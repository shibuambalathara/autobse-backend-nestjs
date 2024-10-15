import { Module } from '@nestjs/common';
import { BidService } from './bid.service';
import { BidResolver } from './bid.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [BidResolver, BidService,PrismaService],
})
export class BidModule {}

import { Module } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerResolver } from './seller.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [SellerResolver, SellerService,PrismaService],
})
export class SellerModule {}

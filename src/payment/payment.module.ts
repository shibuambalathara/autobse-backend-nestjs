import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentResolver } from './payment.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { s3Service } from 'src/services/s3/s3.service';
import { ConfigService } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PaymentResolver, PaymentService, s3Service, ConfigService],
})
export class PaymentModule {}

import { Module } from '@nestjs/common';
import { EnquiryService } from './enquiry.service';
import { EnquiryResolver } from './enquiry.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [EnquiryResolver, EnquiryService,PrismaService],
})
export class EnquiryModule {}

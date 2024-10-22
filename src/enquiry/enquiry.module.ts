import { Module } from '@nestjs/common';
import { EnquiryService } from './enquiry.service';
import { EnquiryResolver } from './enquiry.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [EnquiryResolver, EnquiryService],
})
export class EnquiryModule {}

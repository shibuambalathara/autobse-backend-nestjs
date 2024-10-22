import { Module } from '@nestjs/common';
import { ExceluploadService } from './excelupload.service';
import { ExceluploadResolver } from './excelupload.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ExceluploadResolver, ExceluploadService],
})
export class ExceluploadModule {}

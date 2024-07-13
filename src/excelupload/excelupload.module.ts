import { Module } from '@nestjs/common';
import { ExceluploadService } from './excelupload.service';
import { ExceluploadResolver } from './excelupload.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [ExceluploadResolver, ExceluploadService,PrismaService],
})
export class ExceluploadModule {}

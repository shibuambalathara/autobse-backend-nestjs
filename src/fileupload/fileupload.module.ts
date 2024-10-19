import { Module } from '@nestjs/common';
import { FileuploadService } from './fileupload.service';
import { FileuploadController } from './fileupload.controller';
import { s3Service } from 'src/services/s3/s3.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { compressService } from 'src/services/compress/compress.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [FileuploadController],
  providers: [FileuploadService, s3Service, compressService, PrismaService, ConfigService],
})
export class FileuploadModule {}
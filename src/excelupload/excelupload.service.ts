import { Injectable } from '@nestjs/common';
import { CreateExceluploadInput } from './dto/create-excelupload.input';
import { UpdateExceluploadInput } from './dto/update-excelupload.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExcelUpload } from '@prisma/client';

@Injectable()
export class ExceluploadService {
  constructor(private readonly prisma:PrismaService){}

  async createExcelUpload(id: string,createExceluploadInput: CreateExceluploadInput) :Promise<ExcelUpload|null> {
    return await this.prisma.excelUpload.create({
      data:{
        createdById:id,
        ...createExceluploadInput,
      }
    });
  }

  findAll() {
    return `This action returns all excelupload`;
  }

  findOne(id: number) {
    return `This action returns a #${id} excelupload`;
  }

  update(updateExceluploadInput: UpdateExceluploadInput) {
    return `This action updates a # excelupload`;
  }

  remove(id: number) {
    return `This action removes a #${id} excelupload`;
  }
}

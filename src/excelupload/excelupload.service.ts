import { Injectable } from '@nestjs/common';
import { CreateExceluploadInput } from './dto/create-excelupload.input';
import { UpdateExceluploadInput } from './dto/update-excelupload.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExcelUpload } from '@prisma/client';
import * as XLSX from 'xlsx'; // Import xlsx library
import { createReadStream } from 'fs';
import graphqlUploadExpress, { FileUpload } from 'graphql-upload/GraphQLUpload.mjs';
// import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';

// import { FileUpload, GraphQLUpload } from 'graphql-upload';


@Injectable()
export class ExceluploadService {
  constructor(private readonly prisma:PrismaService){}

  async createExcelUpload(
   
    id: string,
    createExceluploadInput: CreateExceluploadInput
  ): Promise<ExcelUpload|null|Boolean> {

    await this.prisma.excelUpload.create({
      data: {
        createdById: id,
        ...createExceluploadInput,
      
      },
    });


    const stream = createReadStream(await createExceluploadInput.file_filename);

    
    const buffers = [];
  
    for await (const chunk of stream) {
      buffers.push(chunk);
    }
    const buffer = Buffer.concat(buffers);
  
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      await this.prisma.state.create({
        data: {
          name: row[0], 
          createdById: id,
        
        },
      });
    }
    
    return true;
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

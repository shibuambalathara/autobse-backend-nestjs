import { Injectable } from '@nestjs/common';
import { CreateEnquiryInput } from './dto/create-enquiry.input';
import { UpdateEnquiryInput } from './dto/update-enquiry.input';
import { Enquiry } from './models/enquiry.model';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EnquiryService {
  constructor(private readonly prisma:PrismaService){}

  async createEnquiry(createEnquiryInput: CreateEnquiryInput): Promise<Enquiry|null> {
    try{
     return await this.prisma.enquiry.create({
       data:{
      
         ...createEnquiryInput,
       }
     });
     }
    catch(error){
     throw new Error(error.message)
       }
   }

  findAll() {
    return `This action returns all enquiry`;
  }

  findOne(id: number) {
    return `This action returns a #${id} enquiry`;
  }

  update(id: number, updateEnquiryInput: UpdateEnquiryInput) {
    return `This action updates a #${id} enquiry`;
  }

  remove(id: number) {
    return `This action removes a #${id} enquiry`;
  }
}

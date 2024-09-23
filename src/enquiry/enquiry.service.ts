import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEnquiryInput } from './dto/create-enquiry.input';
import { UpdateEnquiryInput } from './dto/update-enquiry.input';
import { Enquiry } from './models/enquiry.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { EnquiryWhereUniqueInput } from './dto/unique-enquiry-input';
import { Prisma } from '@prisma/client';

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

   async Enquiries(): Promise<Enquiry[] | null> {
    const result =  await this.prisma.enquiry.findMany({where:{isDeleted:false}});
    if(!result) throw new NotFoundException("Enquiry Not Found!");    
    return result;
    
  }

  async Enquiry(where:EnquiryWhereUniqueInput) : Promise<Enquiry | null> {
    const result = await this.prisma.enquiry.findUnique({where:{...where as Prisma.EnquiryWhereUniqueInput,isDeleted:false}});
    if(!result) throw new NotFoundException("Enquiry not found")
    return result;
  }

  async updateEnquiry(id: string, updateEnquiryInput: UpdateEnquiryInput) : Promise<Enquiry|null>{
    try {
      const enquiry = await this.prisma.enquiry.findUnique({where:{id,isDeleted:false,}})
      if(!enquiry) throw new NotFoundException("Not Found");
      return await this.prisma.enquiry.update({
          where:{
            id,
          },
          data:{
            ...updateEnquiryInput,
          }
        });
      }
  catch (error) {
        if (error instanceof NotFoundException) {
          throw new Error(error.message); 
          }
        }
    }
  
  
  async deleteEnquiry(id: string) :Promise<Enquiry|null> {
    const result = await this.prisma.enquiry.findUnique({where:{id,isDeleted:false,}})
    if(!result) throw new NotFoundException(" Not Found");
    return await this.prisma.enquiry.update({
        where:{id},
        data:{
          isDeleted:true,
        }
      });
    }
    
  async deletedEnquiries() : Promise<Enquiry[] | null>{
    const result = await this.prisma.enquiry.findMany({where:{isDeleted:true,}});
    if(!result) throw new NotFoundException("Enuiry Not Found");
    return result;
  }

  async restoreEnquiry(where:EnquiryWhereUniqueInput):Promise<Enquiry|null>{
    const enquiry = await this.prisma.enquiry.findUnique({where:{...(where as Prisma.EnquiryWhereUniqueInput),isDeleted:true}});
    if(!enquiry) throw new NotFoundException("Enquiry Not Found");
    return await this.prisma.enquiry.update({
      where:{...where as Prisma.EnquiryWhereUniqueInput},
      data:{
        isDeleted:false,
      }
    });
  }
}

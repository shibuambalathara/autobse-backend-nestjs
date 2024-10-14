import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentInput } from './dto/create-payment.input';
import { UpdatePaymentInput } from './dto/update-payment.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Payment, Prisma } from '@prisma/client';
import { PaymentWhereUniqueInput } from './dto/unique-payment.input';
import { s3Service } from 'src/services/s3/s3.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma:PrismaService,
    private readonly s3Service: s3Service,
    private readonly configService: ConfigService,
  ){}

  async createPayment(createPaymentInput: CreatePaymentInput,paymentUserId:string):Promise<Payment|null> {
    try{
      
      return await this.prisma.payment.create({

        data:{...createPaymentInput,
          createdById:paymentUserId,
          userId:paymentUserId,
  
        },
        include: {
          user: true, 
        },
      })
    }
    catch(error){
      throw new Error(error.message)
    }
  }

  async payments() : Promise<Payment[]|null> {
    const payment = await this.prisma.payment.findMany({where:{isDeleted:false},   include: {
      user: true,  
    },});
    if(!payment) throw new NotFoundException("Not Found")
    return payment;
  }

  async payment(where:PaymentWhereUniqueInput) :Promise<Payment|null>{
    const payment = await this.prisma.payment.findUnique({where:{...where as Prisma.PaymentWhereUniqueInput, isDeleted:false},
      include: {
        user: true,
      }
    });
    if(!payment) throw new NotFoundException("Not Found")
    payment.image = payment.image ? `https://${this.configService.get<string>('AWS_BUCKET')}.${this.configService.get<string>('AWS_STORAGE_TYPE')}.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${payment.image}` : null
    return payment;
  }

  async updatePayment(id:string, updatePaymentInput: UpdatePaymentInput):Promise<Payment|null> {
    try {
      const payment = await this.prisma.payment.findUnique({where:{id,isDeleted:false,}})
      if(!payment) throw new NotFoundException("Payment Not Found");
      return await this.prisma.payment.update({
          where:{
            id,
          },
          data:{
            ...updatePaymentInput,
          }
        });
      }
  catch (error) {
        if (error instanceof NotFoundException) {
          throw new Error(error.message); 
          }
        }
    }
  

  async deletePayment(id: string):Promise<Payment|null> {
    const payment = await this.prisma.payment.findUnique({where:{id,isDeleted:false,}})
    if(!payment) throw new NotFoundException("Payment Not Found");
    return await this.prisma.payment.update({
        where:{id},
        data:{
          isDeleted:true,
        }
      });
    }

  async deletedPayments():Promise<Payment[]|null> {
      const payment = await this.prisma.payment.findMany({where:{isDeleted:true,},
        include: {
          user: true,}});
      if(!payment) throw new NotFoundException("Payment Not Found");
      return payment;
    }
 
  async deletedPayment(id:string):Promise<Payment|null> {
      const payment = await this.prisma.payment.findUnique({where:{id,isDeleted:true,},
        include: {
          user: true,
        }
      });
      if(!payment) throw new NotFoundException("Payment Not Found");
      return payment;
    }
  
  async restorePayment(where:PaymentWhereUniqueInput):Promise<Payment|null> {
    const payment = await this.prisma.payment.findUnique({where:{...(where as Prisma.PaymentWhereUniqueInput),isDeleted:true}});
    if(!payment) throw new NotFoundException("Payment Not Found");
    return await this.prisma.payment.update({
      where:{...where as Prisma.PaymentWhereUniqueInput},
      data:{
        isDeleted:false,
      }
    });
  }

  async countPayments():Promise<number|0>{
    const paymentCount=await this.prisma.payment.count({where:{isDeleted:false}})
    return paymentCount
  }
  
}

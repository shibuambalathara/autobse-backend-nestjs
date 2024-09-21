import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentInput } from './dto/create-payment.input';
import { UpdatePaymentInput } from './dto/update-payment.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Payment, Prisma } from '@prisma/client';
import { PaymentWhereUniqueInput } from './dto/unique-payment.input';

@Injectable()
export class PaymentService {
  constructor(private readonly prisma:PrismaService){}

  async createPayment(createPaymentInput: CreatePaymentInput,paymentUserId:string):Promise<Payment|null> {
    try{
      
      return await this.prisma.payment.create({
        data:{...createPaymentInput,
          createdById:paymentUserId,
          userId:paymentUserId,
  
        }
      })
    }
    catch(error){
      throw new Error(error.message)
    }
  }

  async payments() : Promise<Payment[]|null> {
    const payment = await this.prisma.payment.findMany({where:{isDeleted:false}});
    if(!payment) throw new NotFoundException("Not Found")
    return payment;
  }

  async payment(where:PaymentWhereUniqueInput) :Promise<Payment|null>{
    const payment = await this.prisma.payment.findUnique({where:{...where as Prisma.PaymentWhereUniqueInput, isDeleted:false}});
    if(!payment) throw new NotFoundException("Not Found")
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
      const payment = await this.prisma.payment.findMany({where:{isDeleted:true,}});
      if(!payment) throw new NotFoundException("Payment Not Found");
      return payment;
    }
 
  async deletedPayment(id:string):Promise<Payment|null> {
      const payment = await this.prisma.payment.findUnique({where:{id,isDeleted:true,}});
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
  
}

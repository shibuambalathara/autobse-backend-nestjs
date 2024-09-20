import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { PaymentType } from '../paymentStatus';
import { PaymentStatusTypes } from '@prisma/client';

@InputType()
export class CreatePaymentInput {
  @Field()
  amount?:number;

  @Field({nullable:true})
  description?:string;

  @Field({nullable:true})
  image?:string;

  // @Field({})
  // registrationExpire?:Date;

  @Field({nullable:true})
  @IsOptional()
  @IsEnum(PaymentStatusTypes)
  status?:PaymentStatusTypes =  PaymentStatusTypes.pending;

  @Field(()=>PaymentType) 
  @IsEnum(PaymentType)
  paymentFor:PaymentType;
}

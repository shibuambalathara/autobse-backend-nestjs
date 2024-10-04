import { IsEnum, IsOptional } from 'class-validator';
import { CreatePaymentInput } from './create-payment.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { PaymentStatusTypes, PaymentType } from '../paymentStatus';


@InputType()
export class UpdatePaymentInput extends PartialType(CreatePaymentInput) {
  @Field({nullable:true})
  amount?:number;

  @Field({nullable:true})
  description?:string;

  @Field({nullable:true})
  image?:string;

  @Field({nullable:true})
  registrationExpire?:Date;

  @Field(()=>PaymentStatusTypes,{nullable:true})
  @IsOptional()
  @IsEnum(PaymentStatusTypes)
  status?:PaymentStatusTypes;

  @Field(()=>PaymentType) 
  @IsEnum(PaymentType)
  paymentFor?:PaymentType;
}

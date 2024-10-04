import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { PaymentStatusTypes, PaymentType } from '../paymentStatus';


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

  @Field(()=>PaymentStatusTypes,{nullable:true})
  @IsOptional()
  @IsEnum(PaymentStatusTypes)
  status?:PaymentStatusTypes;

  @Field(()=>PaymentType) 
  @IsEnum(PaymentType)
  paymentFor:PaymentType;
}

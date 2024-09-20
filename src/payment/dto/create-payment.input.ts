import { InputType, Int, Field } from '@nestjs/graphql';
import { PaymentStatusTypes } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

@InputType()
export class CreatePaymentInput {
  @Field()
  amount?:number;

  @Field()
  description?:string;

  @Field()
  image?:string;

  @Field()
  registrationExpire?:Date;

  @Field()
  @IsOptional()
  @IsEnum(PaymentStatusTypes)
  status?:PaymentStatusTypes =  PaymentStatusTypes.pending;
}

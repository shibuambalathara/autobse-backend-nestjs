import { InputType, Int, Field } from '@nestjs/graphql';
import { PaymentStatusTypes } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

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
}

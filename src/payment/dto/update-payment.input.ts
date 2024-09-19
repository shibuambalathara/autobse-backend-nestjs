import { CreatePaymentInput } from './create-payment.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

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

  @Field({nullable:true})
  statusId?:string;
}

import { InputType, Int, Field } from '@nestjs/graphql';

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
}

import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class PaymentWhereUniqueInput {

  @Field({nullable:true})
  id?:string;


}

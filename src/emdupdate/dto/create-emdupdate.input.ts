import { InputType, Int, Field } from '@nestjs/graphql';
import { Payment } from 'src/payment/models/payment.model';
import { User } from 'src/user/models/user.model';

@InputType()
export class CreateEmdupdateInput {
  

  @Field({nullable:true})
  vehicleBuyingLimitIncrement?:number;
  

  // @Field()
  // paymentId:string;

  
  // @Field()
  // userId:string;


}

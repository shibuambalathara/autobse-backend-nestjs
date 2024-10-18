import { CreateEmdupdateInput } from './create-emdupdate.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateEmdupdateInput extends PartialType(CreateEmdupdateInput) {
  @Field({nullable:true})
  vehicleBuyingLimitIncrement?:number;
  

  @Field({nullable:true})
  paymentId?:string;

  
  @Field({nullable:true})
  userId?:string;
}

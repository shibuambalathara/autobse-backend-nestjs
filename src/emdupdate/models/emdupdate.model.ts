import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Payment } from 'src/payment/models/payment.model';
import { User } from 'src/user/models/user.model';

@ObjectType()
export class Emdupdate {
  @Field()
  id:string;

  @Field()
  emdNo:number;

  @Field({nullable:true})
  vehicleBuyingLimitIncrement?:number;
  
  
  @Field(()=>Payment,{nullable:true})
  payment:Payment

  
  @Field(()=>User,{nullable:true})
  user:User

  
  @Field({nullable:true})
  createdAt?:Date;

  @Field({nullable:true})
  updatedAt?:Date;

  @Field(()=>User,{nullable:true})
  createdBy:User 

}

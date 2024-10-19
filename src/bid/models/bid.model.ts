import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/user/models/user.model';

@ObjectType()
export class Bid {
  @Field() 
  id:string;

  @Field()
  name:string;

  @Field()
  amount:number;

  @Field()
  userId:string;

  @Field()
  bidVehicleId:string;

  @Field(()=>User,{nullable:true})
  user?:User;
}

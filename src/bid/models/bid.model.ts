import { ObjectType, Field, Int } from '@nestjs/graphql';

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
}

import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Seller {
  @Field()
  id:string;

  @Field()
  name:string;

  @Field()
  contactPerson:string;

  @Field()
  GSTNumbber:string;

  @Field()
  billingContactPerson:string;

  @Field()
  mobile:string;

  @Field()
  nationalHead:string;
  

  @Field()
  logo:string;
  
}

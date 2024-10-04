import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Seller {
  @Field()
  id:string;

  @Field()
  name:string;

  @Field({nullable:true})
  contactPerson?:string;

  @Field()
  GSTNumber?:string;

  @Field()
  billingContactPerson?:string;

  @Field()
  mobile?:string;

  @Field()
  nationalHead?:string;
  
  @Field()
  logo?:string;

  @Field()
  createdAt?:Date;

  @Field()
  updatedAt?:Date;

  @Field()
  createdById?:string;

  
  
}

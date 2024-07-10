import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Location {
  
  @Field()
  id:string;

  @Field()
  name:string;

  @Field()
  stateId:string;

  @Field({nullable:true})
  createdAt?:Date;

  @Field({nullable:true})
  updatedAt?:Date;

  @Field({nullable:true})
  country?:string;

  @Field({nullable:true})
  createdById?:string;
  
}

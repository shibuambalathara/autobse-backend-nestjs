import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Location {
  
  @Field()
  id:string;

  @Field()
  name:string;

  @Field()
  state:string;
  
}

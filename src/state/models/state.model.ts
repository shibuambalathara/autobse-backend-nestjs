import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class State {

  @Field()
  id:string;
  
  @Field()
  name:string;

}

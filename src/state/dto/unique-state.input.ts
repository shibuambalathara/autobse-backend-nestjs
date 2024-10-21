import { InputType, Int, Field, ID } from '@nestjs/graphql';


@InputType()
export class StateWhereUniqueInput {

  @Field({nullable:true})
  id?:string;

 
}

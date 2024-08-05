import { InputType, Int, Field, ID } from '@nestjs/graphql';

@InputType()
export class RecentsoldWhereUniqueInput {

  @Field({nullable:true})
  id?:string;

}

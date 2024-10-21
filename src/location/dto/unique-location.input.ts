import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { StateNames } from '@prisma/client';

@InputType()
export class LocationWhereUniqueInput {

  @Field({nullable:true})
  id?:string;

  @Field({nullable:true})
  name?:string;

  @Field({nullable:true})
  state?:string;


}

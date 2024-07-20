import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { StateNames } from '@prisma/client';
import { IsString } from 'class-validator';

@InputType()
export class LocationWhereUniqueInput {

  @Field({nullable:true})
  id?:string;

  @Field({nullable:true})
  name?:string;

  @Field({nullable:true})
  state?:StateNames;


}

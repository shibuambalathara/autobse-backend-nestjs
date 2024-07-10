import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class LocationWhereUniqueInput {

  @Field({nullable:true})
  id?:string;

  @Field({nullable:true})
  name?:string;


}

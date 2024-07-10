import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class VehicleCategoryWhereUniqueInput {

  @Field({nullable:true})
  id:string;

  @Field({nullable:true})
  name?:string;

}
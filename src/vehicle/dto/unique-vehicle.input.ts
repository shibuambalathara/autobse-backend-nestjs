import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class VehicleWhereUniqueInput {

  @Field({nullable:true})
  id?:string;

}
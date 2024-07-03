import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class UniqueVehicleCategoryInput {

  @Field(()=>ID)
  id:string;

}
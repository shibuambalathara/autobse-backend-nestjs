import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class UniqueLocationInput {

  @Field(()=>ID)
  id:string;

}

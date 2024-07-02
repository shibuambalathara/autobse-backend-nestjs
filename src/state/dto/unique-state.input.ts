import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class UniqueInput {

  @Field(()=>ID)
  id:string;
 
  @Field({ nullable: true })
  name?: string;


}

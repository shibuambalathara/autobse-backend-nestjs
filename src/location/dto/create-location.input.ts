import { InputType, Int, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateLocationInput {
  
  @Field()
  @IsString()
  name:string;


}

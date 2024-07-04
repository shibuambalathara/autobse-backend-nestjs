import { InputType, Int, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateStateInput {

  @Field()
  @IsString()
  name:string;

}

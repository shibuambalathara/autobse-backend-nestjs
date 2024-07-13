import { InputType, Int, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CreateStateInput } from 'src/state/dto/create-state.input';

@InputType()
export class CreateLocationInput {
  
  @Field()
  @IsString()
  name:string;

}







import { IsString } from 'class-validator';
import { CreateLocationInput } from './create-location.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateLocationInput extends PartialType(CreateLocationInput) {


  @Field()
  @IsString()
  name?: string;

  @Field()
  stateId?:string;
}

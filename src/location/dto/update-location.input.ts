import { IsString } from 'class-validator';
import { CreateLocationInput } from './create-location.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateLocationInput extends PartialType(CreateLocationInput) {

  @Field({nullable:true})
  @IsString()
  name?: string;

  @Field({nullable:true})
  state?:string;
}

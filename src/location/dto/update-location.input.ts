import { IsString } from 'class-validator';
import { CreateLocationInput } from './create-location.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { StateNames } from '@prisma/client';

@InputType()
export class UpdateLocationInput extends PartialType(CreateLocationInput) {

  @Field({nullable:true})
  @IsString()
  name?: string;

  @Field(()=>StateNames,{nullable:true})
  state?:StateNames;
}

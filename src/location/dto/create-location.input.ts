import { InputType, Int, Field, registerEnumType } from '@nestjs/graphql';
import { StateNames } from '@prisma/client';
import { IsString } from 'class-validator';

@InputType()
export class CreateLocationInput {
  
  @Field()
  @IsString()
  name:string;

  @Field(()=>StateNames)
  state:StateNames;

}


registerEnumType(StateNames, {
    name: 'StateNames',
  });





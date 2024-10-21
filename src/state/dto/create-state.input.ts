import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { StateNames } from '@prisma/client';
import { IsEnum } from 'class-validator';


@InputType()
export class CreateStateInput {

    @Field(()=>StateNames)
    @IsEnum(StateNames)
    name:StateNames;
 
}

registerEnumType(StateNames, {
    name: 'StateNames',
  });


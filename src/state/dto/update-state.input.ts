import { CreateStateInput } from './create-state.input';
import { InputType, Field, Int, PartialType, registerEnumType } from '@nestjs/graphql';
import { StateNames } from '@prisma/client';
import { IsEnum } from 'class-validator';

@InputType()
export class UpdateStateInput extends PartialType(CreateStateInput) {
  
  @Field(()=>StateNames,{nullable:true})
  @IsEnum(StateNames)
  name?:StateNames;

  @Field({nullable:true})
  createdById?:string;
}

registerEnumType(StateNames, {
    name: 'StateNames',
  });

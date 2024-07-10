import { CreateStateInput } from './create-state.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateStateInput extends PartialType(CreateStateInput) {
  @Field({nullable:true})
  name?:string;

  @Field({nullable:true})
  createdById?:string;
}

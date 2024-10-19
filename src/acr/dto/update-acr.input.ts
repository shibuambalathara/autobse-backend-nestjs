import { CreateAcrInput } from './create-acr.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAcrInput extends PartialType(CreateAcrInput) {
  @Field(() => Int)
  id: number;
}

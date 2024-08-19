import { CreateBullInput } from './create-bull.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateBullInput extends PartialType(CreateBullInput) {
  @Field(() => Int)
  id: number;
}

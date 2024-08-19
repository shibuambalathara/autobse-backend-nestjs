import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateBullInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}

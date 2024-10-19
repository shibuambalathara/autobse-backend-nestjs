import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateAcrInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}

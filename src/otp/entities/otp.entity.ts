import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Otp {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}

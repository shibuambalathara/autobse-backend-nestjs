import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Bull {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}

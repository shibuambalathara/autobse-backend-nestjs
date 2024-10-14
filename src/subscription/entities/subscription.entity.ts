import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class SubscriptionEntity {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}

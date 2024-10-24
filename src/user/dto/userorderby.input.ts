import { InputType, Field } from '@nestjs/graphql';
import { OrderDirection } from '../../common/order-direction'

@InputType()
export class UserOrderByInput {
  @Field(() => OrderDirection, { nullable: true })
  idNo?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  createdAt?: OrderDirection;

  
  @Field(() => OrderDirection, { nullable: true })
  id?: OrderDirection;

}

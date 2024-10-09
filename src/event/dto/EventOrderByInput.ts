import { InputType, Field } from '@nestjs/graphql';
import { OrderDirection } from '../../common/order-direction'

@InputType()
export class EventOrderByInput {
  @Field(() => OrderDirection, { nullable: true })
  bidLock?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  createdAt?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  endDate?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  eventCategory?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  eventNo?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  extraTime?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  extraTimeTrigerIn?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  firstVehicleBidTimeExpire?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  gapInBetweenVehicles?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  id?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  isSpecialEvent?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  noOfBids?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  pauseDate?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  pausedTotalTime?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  startDate?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  status?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  termsAndConditions?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  updatedAt?: OrderDirection;

  @Field(() => OrderDirection, { nullable: true })
  vehicleLiveTimeIn?: OrderDirection;
}

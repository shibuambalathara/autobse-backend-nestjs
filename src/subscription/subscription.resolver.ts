import { Resolver, Subscription, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SubscriptionService } from './subscription.service';
import { RedisService } from 'src/services/redis/redis.service';
import { Vehicle } from 'src/vehicle/models/vehicle.model';
import { resolve } from 'path';
import { Bid } from 'src/bid/models/bid.model';

@Resolver(() => Subscription)
export class SubscriptionResolver {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly redisService: RedisService,
  ) {}


  @Subscription(()=> Vehicle, { name: 'subscriptionVehicleUpdates', resolve: (payload)=>payload.vehicleUpdate})
  getAllSubscriptionVehicleUpdates() {
    return this.redisService.asyncIterator('VEHICLE_UPDATES')
  }

  @Subscription(()=> Bid, { name: 'subscriptionBidCreation', resolve: (payload)=>payload.bidCreation})
  getAllSubscriptionBidCreation() {
    return this.redisService.asyncIterator('BID_CREATION')
  }
}

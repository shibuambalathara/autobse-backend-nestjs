import { Resolver, Subscription, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SubscriptionService } from './subscription.service';
import { RedisService } from 'src/services/redis/redis.service';
import { Vehicle } from 'src/vehicle/models/vehicle.model';
import { resolve } from 'path';
import { Bid } from 'src/bid/models/bid.model';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/role/role.decorator';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/role.guard';

@Resolver(() => Subscription)
export class SubscriptionResolver {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly redisService: RedisService,
  ) {}


  @Subscription(()=> Vehicle, { name: 'subscriptionVehicleUpdates', resolve: (payload)=>payload.vehicleUpdate})
  getAllSubscriptionVehicleUpdates() {
    return this.redisService.getVehicleUpdateIterator()
  }

  @Subscription(()=> Bid, { name: 'subscriptionBidCreation', resolve: (payload)=>payload.bidCreation})
  // @UseGuards(GqlAuthGuard,RolesGuard)
  // @Roles('admin','staff')
  getAllSubscriptionBidCreation() {
    return this.redisService.getBidCreationIterator()
  }
}

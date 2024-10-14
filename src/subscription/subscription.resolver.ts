import { Resolver, Subscription, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SubscriptionService } from './subscription.service';
import { RedisService } from 'src/services/redis/redis.service';
import { Vehicle } from 'src/vehicle/models/vehicle.model';

@Resolver(() => Subscription)
export class SubscriptionResolver {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly redisService: RedisService,
  ) {}


  @Subscription(()=> Vehicle, { name: 'subscriptionAllTopics'})
  getAllTopics() {
    return this.redisService.asyncIterator('ALL_TOPICS')
  }
}
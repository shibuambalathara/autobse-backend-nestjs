import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionResolver } from './subscription.resolver';
import { RedisService } from 'src/services/redis/redis.service';

@Module({
  providers: [SubscriptionResolver, SubscriptionService, RedisService],
})
export class SubscriptionModule {}

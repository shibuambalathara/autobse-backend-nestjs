import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionResolver } from './subscription.resolver';
import { RedisService } from 'src/services/redis/redis.service';
import { RedisModule } from 'src/services/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [SubscriptionResolver, SubscriptionService],
})
export class SubscriptionModule {}

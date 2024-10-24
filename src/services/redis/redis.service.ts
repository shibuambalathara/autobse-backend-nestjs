import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bid, Vehicle } from '@prisma/client';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy, OnModuleInit {
    private pubSub: RedisPubSub
    private publisher: Redis
    private subscriber: Redis
    private bidCreationIterator: AsyncIterator<Bid>
    private vehicleUpdateIterator: AsyncIterator<Vehicle>

    constructor(
        private readonly configService: ConfigService,
    ) {
        const redisOptions = {
            host: this.configService.get<string>('REDIS_HOST'),
            port: parseInt(this.configService.get<string>('REDIS_PORT')),
            password: this.configService.get<string>('REDIS_PASS'),
            
        };

        this.publisher = new Redis(redisOptions)
        this.subscriber = new Redis(redisOptions)

        // Initialize Redis PubSub with a Redis publisher and subscriber
        this.pubSub = new RedisPubSub({
            publisher: this.publisher,
            subscriber: this.subscriber,
        });

        this.bidCreationIterator = this.pubSub.asyncIterator('BID_CREATION')
        this.vehicleUpdateIterator = this.pubSub.asyncIterator('VEHICLE_UPDATES')

    }

    async publish(trigger: string, payload: any): Promise<void> {
        await this.pubSub.publish(trigger, payload)
    }

    asyncIterator(trigger: string) {
        return this.pubSub.asyncIterator(trigger)
    }

    async onModuleInit() {
        // Optionally, you can validate Redis connection
        await this.publisher.ping()
        await this.subscriber.ping()
        console.log('RedisService: Successfully connected.')
    }


    onModuleDestroy() {
        this.pubSub.close()
        this.publisher.quit()
        this.subscriber.quit()
        console.log('RedisService: Connection closed.')
    }

    getBidCreationIterator(): AsyncIterator<Bid> {
        return this.bidCreationIterator
      }
    
    getVehicleUpdateIterator(): AsyncIterator<Vehicle> {
        return this.vehicleUpdateIterator
    }
}

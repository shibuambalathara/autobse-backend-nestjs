import { Injectable, OnModuleInit } from '@nestjs/common';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'; // Use BullMQAdapter for bullmq
import { ExpressAdapter } from '@bull-board/express';
import { Queue } from 'bullmq';
import * as express from 'express';
import { Redis } from 'ioredis';

@Injectable()
export class BullBoardService implements OnModuleInit {
  private redis: Redis;
  private vehicleBidQueue: Queue;

  constructor() {
    this.redis = new Redis({
      host: 'localhost',
      port: 6379,
      password: 'redis'
    });

    this.vehicleBidQueue = new Queue('vehicle-bid', {
      connection: this.redis,
    });
    console.log('Vehicle Bid Queue created:', this.vehicleBidQueue.name);

  }

  onModuleInit() {
    
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/admin/queues');
  
    createBullBoard({
      queues: [new BullMQAdapter(this.vehicleBidQueue)], 
      serverAdapter,
    });
  
    const app = express();
    app.use('/admin/queues', serverAdapter.getRouter());
    app.listen(3001, () => {
      console.log(`BullBoard is running on port 3001`);
    });
  }
}

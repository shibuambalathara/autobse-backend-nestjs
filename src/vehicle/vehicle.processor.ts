import { Injectable } from '@nestjs/common';
import { Job, Queue, Worker} from 'bullmq';
import { PrismaService } from 'src/prisma/prisma.service'; 
import { Vehicle } from './models/vehicle.model';

@Injectable()
export class VehicleQueueProcessor {
  private vehicleBidQueue: Queue;
  private worker: Worker;

  constructor(private prisma: PrismaService) {
    // Initialize your queue with Redis configuration
    this.vehicleBidQueue = new Queue('vehicleBidQueue', {
      connection: {
        host: 'localhost',
        port: 6379,
        password:"redis"
      },
    });

    // Initialize the worker with Redis configuration
    this.initializeProcessor();
  }

  private initializeProcessor() {
    this.worker = new Worker('vehicleBidQueue', async (job) => {
      const { vehicle } = job.data;

      // Display the vehicle (e.g., show it in the UI, or perform other actions)
      console.log(`Displaying vehicle: ${vehicle.id}`);

      // After displaying the vehicle, update its status or perform additional actions
    }, {
      connection: {
        host: 'localhost',
        port: 6379,
        password:"redis"
      },
    });

    // Handle worker events for error logging or other purposes
    this.worker.on('completed', (job) => {
      console.log(`Job completed: ${job.id}`);
    });

    this.worker.on('failed', (job, err) => {
      console.error(`Job failed: ${job.id}, error: ${err.message}`);
    });
  }
  async handleVehicle(job:Job) {
    const vehicle = job.data.vehicle;
    const startTime = new Date(vehicle.bidStartTime).getTime();
    const endTime = new Date(vehicle.bidTimeExpire).getTime();
    const currentTime = Date.now();

    const remainingTime = endTime - currentTime;

    if (remainingTime > 0) {
      setTimeout(() => this.processNextVehicle(vehicle), remainingTime);
    } else {
      this.processNextVehicle(vehicle);
    }
  }
  processNextVehicle(job:Job) {
    const vehicle = job.data.vehicle;
    return vehicle;
  }
}

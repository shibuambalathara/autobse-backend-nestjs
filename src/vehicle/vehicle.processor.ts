// import { Injectable } from '@nestjs/common';
// import { Job, Queue, Worker} from 'bullmq';
// import { PrismaService } from 'src/prisma/prisma.service'; 
// import { Vehicle } from './models/vehicle.model';

// @Injectable()
// export class VehicleQueueProcessor {
//   private vehicleBidQueue: Queue;
//   private worker: Worker;

//   constructor(private prisma: PrismaService) {
//     // Initialize your queue with Redis configuration
//     const vehicleBidQueue = new Queue('vehicleBidQueue', {
//       connection: {
//         host: 'localhost',
//         port: 6379,
//         password:"redis"
//       },
//     });
//     // Initialize the queue
    
//     let isProcessing = false;
    
//     const vehicleBidWorker = new Worker('vehicleBidQueue', async job => {
//       if (isProcessing) {
//         console.log(`Skipping job ${job.id} as another vehicle is active.`);
//         return;
//       }
    
//       isProcessing = true;
    
//       const vehicle = job.data.vehicle;
//       console.log(`Activating vehicle ${vehicle.vehicleId} for bidding.`);
    
//       // Set a timeout to release the lock after the vehicle's time expires
//       const currentTime = Date.now();
//       const expireTime = new Date(vehicle.bidTimeExpire).getTime();
//       const timeToWait = Math.max(expireTime - currentTime, 0);
    
//       setTimeout(async () => {
//         console.log(`Vehicle ${vehicle.vehicleId} bidding time expired.`);
//         isProcessing = false;
    
//         // Move on to the next vehicle in the queue
//         await processNextVehicle();
//       }, timeToWait);
//     }, { connection: {  host: 'localhost',
//       port: 6379,
//       password:"redis" } });
    
//     async function processNextVehicle() {
//       const waitingJobs = await vehicleBidQueue.getJobs(['waiting'], 0, 1, false);
    
//       if (waitingJobs.length > 0) {
//         const nextJob = waitingJobs[0];
//         console.log(`Next vehicle ${nextJob.id} is being activated.`);
//         await nextJob.promote(); // Promote the job to be processed
//       } else {
//         console.log('No more vehicles to activate.');
//       }
//     }
    
//     vehicleBidWorker.on('failed', (job, err) => {
//       console.error(`Job ${job.id} failed:`, err);
//     });
    
//   }
// }
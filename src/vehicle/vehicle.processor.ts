// // vehicle.processor.ts
// import { InjectQueue, Processor } from '@nestjs/bull';
// import { Job, Queue } from 'bull';
// import { PrismaService } from '../prisma/prisma.service';
// import { Process } from '@nestjs/bull';

// @Processor('vehicle-bid')
// export class VehicleProcessor {
//   constructor(private readonly prisma: PrismaService,
//     @InjectQueue('vehicle-bid') private readonly vehicleBidQueue: Queue,
//   ) {}

//   @Process('bid')
//   async handleBid(job: Job) {
//     const { vehicleId, incrementTime } = job.data;

//     // Fetch the vehicle
//     const vehicle = await this.prisma.vehicle.findUnique({
//       where: { id: vehicleId },
//     });

//     if (vehicle) {
//       // Update the vehicle's bid end time
//       await this.prisma.vehicle.update({
//         where: { id: vehicleId },
//         data: {
//           bidTimeExpire: new Date(vehicle.bidTimeExpire.getTime() + incrementTime * 60000),
//         },
//       });

//     //   // Check if there's another vehicle to bid
//     //   const nextVehicle = await this.prisma.vehicle.findFirst({
//     //     where: { /* your conditions here */ },
//     //   });

//     //   if (nextVehicle) {
//     //     // Add the next vehicle to the bid queue
//     //     await this.vehicleBidQueue.add('bid', { vehicleId: nextVehicle.id, incrementTime: 1 }, {
//     //       delay: nextVehicle.bidStartTime.getTime() - Date.now(),
//     //     });
//     //   }
//      }
//   }
// }

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBidInput } from './dto/create-bid.input';
import { UpdateBidInput } from './dto/update-bid.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Bid, Prisma } from '@prisma/client';
import { BidWhereUniqueInput } from './dto/unique-bid.input';

@Injectable()
export class BidService {
  constructor(private readonly prisma: PrismaService) { }

  async createBid(userId: string, bidVehicleId: string, createBidInput: CreateBidInput): Promise<Bid | null> {
    try {
      console.log("createBidInput", createBidInput, userId, bidVehicleId);
      const { amount } = createBidInput;
  
      const [bidVehicle, bidCount, user, myBidMaxAmount] = await Promise.all([
        this.prisma.vehicle.findUnique({
          where: { id: bidVehicleId },
          select: {
            id: true,
            currentBidAmount: true,
            startBidAmount: true,
            bidTimeExpire: true,
            quoteIncreament:true,
            currentBidUser: { select: { id: true } },
            event: {
              select: {
                startDate: true,
                status: true,
                noOfBids: true,
                seller: { select: { id: true, name: true } },
                bidLock: true,
                location: { select: { state: true } }
              }
            }
          }
        }),
        this.prisma.bid.count({
          where: {
            bidVehicleId: bidVehicleId,
            userId: userId,
          }
        }),
        this.prisma.user.findUnique({
          where: { id: userId },
          select: {
            status: true,
            vehicleBuyingLimit: true,
            state: true,
            payments: {
              select: {
                registrationExpire: true,
                status: true
              }
            }
          }
        }),
        this.prisma.bid.findFirst({
          where: {
            bidVehicleId: bidVehicleId,
            userId: userId,
          },
          orderBy: { amount: 'desc' }
        })
      ]);
  
      if (!bidVehicle) {
        throw new Error("Vehicle not found.");
      }
  
      if (new Date(bidVehicle.bidTimeExpire) < new Date()) {
        throw new Error("The auction has ended.");
      }
  
      if (new Date(bidVehicle.event.startDate) > new Date()) {
        throw new Error("The auction hasn't started yet.");
      }
  
      if (bidVehicle.event.status !== "active") {
        throw new Error("The auction is not active.");
      }
  
      if (bidCount >= bidVehicle.event.noOfBids) {
        throw new Error("No more bids are allowed.");
      }
      
   

      if (amount % bidVehicle?.quoteIncreament !== 0) {
        throw new Error(`Bid amount must be a multiple of ${bidVehicle?.quoteIncreament}`);
      }


      if (Number(bidVehicle.startBidAmount) > amount) {
        throw new Error(`Bid amount is smaller than the start bid amount: ${bidVehicle.startBidAmount}`);
      }
  
      if (myBidMaxAmount && myBidMaxAmount.amount >= amount) {
        throw new Error(`Bid amount is smaller than your previous bid: ${myBidMaxAmount.amount}`);
      }
  
      if (bidVehicle.event.bidLock === "locked" && bidVehicle.currentBidAmount >= amount) {
        throw new Error(`Bid amount is smaller than the current bid: ${bidVehicle.currentBidAmount}`);
      }
  
      if (bidVehicle.currentBidUser?.id !== userId && user?.vehicleBuyingLimit <= 0) {
        throw new Error("Insufficient buying limit.");
      }
  
      const [bidVehicle1, user1] = await Promise.all([
        this.prisma.vehicle.findUnique({
          where: { id: bidVehicleId },
          select: { registrationNumber: true },
        }),
        this.prisma.user.findUnique({
          where: { id: userId },
          select: { username: true },
        }),
      ]);
  
      const bidName = `${user1?.username} : ${bidVehicle1?.registrationNumber}`;
  
      const createBid = await this.prisma.bid.create({
        data: {
          ...createBidInput,
          userId,
          bidVehicleId,
        }
      });
  
      if (!createBid) {
        throw new Error("Failed to create a bid.");
      }
  
      // Post-bid creation logic
      const bidVehicle2 = await this.prisma.vehicle.findUnique({
        where: { id: bidVehicleId },
        select: {
          bidTimeExpire: true,
          currentBidAmount: true,
          event: {
            select: {
              id: true,
              extraTime: true,
              extraTimeTrigerIn: true,
              eventCategory: true
            }
          }
        }
      });
  
      if (bidVehicle2.currentBidAmount < amount) {
        const durationInMinutes = (bidVehicle2.event.extraTimeTrigerIn ?? 2) * 60000;
        const addBidTime = (bidVehicle2.event.extraTime ?? 2) * 60000;
        const bidTimeExpire =
          new Date(bidVehicle.bidTimeExpire).getTime() - durationInMinutes <= new Date().getTime()
          ? new Date(new Date(bidVehicle.bidTimeExpire).getTime() + addBidTime)
          : new Date(bidVehicle.bidTimeExpire);
  
        await this.prisma.vehicle.update({
          where: { id: bidVehicleId },
          data: {
            currentBidAmount: amount,
            bidTimeExpire,
            currentBidUser: { connect: { id: userId } },
          }
        });
  
        if (bidVehicle2.event.eventCategory === "online") {
          const lastVehicleBidTimeExpire = await this.prisma.vehicle.findFirst({
            where: { event: { id: bidVehicle2.event.id } },
            orderBy: { bidTimeExpire: "desc" },
            select: { bidTimeExpire: true },
          });
  
          await this.prisma.event.update({
            where: { id: bidVehicle2.event.id },
            data: { endDate: lastVehicleBidTimeExpire.bidTimeExpire },
          });
        }
      }
  
      return createBid;
    } catch (error) {
      console.error("Error creating bid:", error);
      throw new Error(`Bid creation failed: ${error.message}`);
    }
  }
  

  async findAll(): Promise<Bid[] | null> {
    return await this.prisma.bid.findMany({where:{isDeleted:false,},include:{user:true}})
  }

  async findOne(where:BidWhereUniqueInput): Promise<Bid | null> {
    const bid =await this.prisma.bid.findUnique({where:{...where as Prisma.BidWhereUniqueInput,isDeleted:false},
      include:{
        user:true
      }})
    if(!bid) throw new NotFoundException(" Not Found");
    return bid;
  }

  async update(where:BidWhereUniqueInput, updateBidInput: UpdateBidInput) : Promise<Bid | null>{
    const bid = await this.prisma.bid.update({where:{...where as Prisma.BidWhereUniqueInput,isDeleted:false},data:{...updateBidInput}});
    if(!bid) throw new NotFoundException(" Not Found");
    return bid;
  }

  async deleteBid(where): Promise<Bid | null> {
    const bid =await this.prisma.bid.findUnique({where:{...where as Prisma.BidWhereUniqueInput,isDeleted:false}})
    if(!bid) throw new NotFoundException(" Not Found");
    return await this.prisma.bid.update({where:{...where as Prisma.BidWhereUniqueInput,isDeleted:false},
      data:{
      isDeleted:true,
    }});
  }
}

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
      return await this.prisma.bid.create({
        data: {
          ...createBidInput,
          userId:userId,
          bidVehicleId:bidVehicleId
        }
      });
      
    }
    catch (error) {
      throw new Error(error.message)  
    }
  }

  async findAll(): Promise<Bid[] | null> {
    return await this.prisma.bid.findMany({where:{isDeleted:false,}})
  }

  async findOne(where:BidWhereUniqueInput): Promise<Bid | null> {
    const bid =await this.prisma.bid.findUnique({where:{...where as Prisma.BidWhereUniqueInput,isDeleted:false}})
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

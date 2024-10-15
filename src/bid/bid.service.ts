import { Injectable } from '@nestjs/common';
import { CreateBidInput } from './dto/create-bid.input';
import { UpdateBidInput } from './dto/update-bid.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Bid } from '@prisma/client';

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

  // async findAll() {
  //   return await this.prisma.bid.findMany({where:{isDeleted:false,}})
  // }

  async findOne(id: string) {
    return await this.prisma.bid.findUnique({where:{id,isDeleted:false}})
  }

  async update(id: string, updateBidInput: UpdateBidInput) {
    return await this.prisma.bid.update({where:{id},data:{...updateBidInput}});
  }

  async deleteBid(id: string) {
    return await this.prisma.bid.update({where:{id},
      data:{
      isDeleted:true,
    }});
  }
}

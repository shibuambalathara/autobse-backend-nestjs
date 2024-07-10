import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSellerInput } from './dto/create-seller.input';
import { UpdateSellerInput } from './dto/update-seller.input';
import { Seller } from './models/seller.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { SellerWhereUniqueInput } from './dto/unique-seller.input';
import { Prisma } from '@prisma/client';

@Injectable()
export class SellerService {
  constructor(private readonly prisma:PrismaService){}

  async createSeller(userId:string,createSellerInput: CreateSellerInput):Promise<Seller|null> {
    try{
      return await this.prisma.seller.create({
        data:{
          createdById:userId,
          ...createSellerInput,
        }
      })
    }
    catch(error){
      throw new Error(error.message);
    }
  }

  async sellers() : Promise<Seller[] | null> {
    const seller = await this.prisma.seller.findMany({where:{isDeleted:false}});
    if(!seller) throw new NotFoundException("Seller Not Found");
    return seller;
  }

  async seller(where:SellerWhereUniqueInput) :Promise<Seller|null>{
    const seller = await this.prisma.seller.findUnique({where:{...where as Prisma.SellerWhereUniqueInput,isDeleted:false}});
    if(!seller) throw new NotFoundException("Seller not found");
    return seller;
  }

  async updateSeller(id:string,updateSellerInput: UpdateSellerInput) : Promise<Seller|null>{
    try {
      const seller = await this.prisma.seller.findUnique({where:{id,isDeleted:false,}})
      if(!seller) throw new NotFoundException("Seller Not Found");
      return await this.prisma.seller.update({
          where:{
            id,
          },
          data:{
            ...updateSellerInput,
          }
        });
      }
    catch (error) {
        if (error instanceof NotFoundException) {
          throw new Error(error.message); 
          }
        }
    }

  async deleteSeller(id: string):Promise<Seller|null> {
    try{
      return await this.prisma.seller.update({where:{id,isDeleted:false},
      data:{
        isDeleted:true,
      }});
    }
    catch(error){
      throw new Error(error.message);
    }
  }

  async deletedSellers():Promise<Seller[]|null>{
    const seller = await this.prisma.seller.findMany({where:{isDeleted:true}});
    if(!seller) throw new NotFoundException("Seller Not Found");
    return seller;
  }

  async deletedSeller(id:string):Promise<Seller|null>{
    const seller = await this.prisma.seller.findUnique({where:{id,isDeleted:true}});
    if(!seller) throw new NotFoundException("Seller Not Found");
    return seller;
  }
}

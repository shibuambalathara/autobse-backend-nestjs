import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSellerInput } from './dto/create-seller.input';
import { UpdateSellerInput } from './dto/update-seller.input';
import { Seller } from './models/seller.model';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SellerService {
  constructor(private readonly prisma:PrismaService){}

  async createSeller(createSellerInput: CreateSellerInput):Promise<Seller> {
    try{
      return await this.prisma.seller.create({
        data:{
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

  async seller(id: string) :Promise<Seller|null>{
    const seller = await this.prisma.seller.findUnique({where:{id,isDeleted:false}});
    if(!seller) throw new NotFoundException("Seller not found");
    return seller;
  }

  async updateSeller(id:string,updateSellerInput: UpdateSellerInput) : Promise<Seller>{
    try{
      return await this.prisma.seller.update({where:{id,isDeleted:false},
      data:{
        ...updateSellerInput,
      }})
    }
    catch(error){
      throw new Error(error.message);
    }
  }

  async deleteSeller(id: string):Promise<Seller> {
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
}

import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SellerService } from './seller.service';
import { Seller } from './models/seller.model';
import { CreateSellerInput } from './dto/create-seller.input';
import { UpdateSellerInput } from './dto/update-seller.input';
import { SellerWhereUniqueInput } from './dto/unique-seller.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';

@Resolver(() => Seller)
export class SellerResolver {
  constructor(private readonly sellerService: SellerService) {}

  @Mutation(returns => Seller)
  @UseGuards(GqlAuthGuard)
  async createSeller(@Args('userId') userId:string,@Args('createSellerInput') createSellerInput: CreateSellerInput):Promise<Seller|null> {
    return this.sellerService.createSeller(userId,createSellerInput);
  }

  @Query(returns => [Seller])
  async sellers():Promise<Seller[]|null> {
    return this.sellerService.sellers();
  }

  @Query(returns => Seller)
  async seller(@Args('where') where:SellerWhereUniqueInput):Promise<Seller|null> {
    return this.sellerService.seller(where);
  }

  @Mutation(returns => Seller)
  @UseGuards(GqlAuthGuard)
  async updateSeller(@Args('where') where:SellerWhereUniqueInput,@Args('updateSellerInput') updateSellerInput: UpdateSellerInput):Promise<Seller|null> {
    return this.sellerService.updateSeller(where.id,updateSellerInput);
  }

  @Mutation(returns => Seller)
  @UseGuards(GqlAuthGuard)
  async deleteSeller(@Args('where') where:SellerWhereUniqueInput):Promise<Seller|null> {
    return this.sellerService.deleteSeller(where.id);
  }

  @Query(returns => [Seller])
  @UseGuards(GqlAuthGuard)
  async deletedSellers():Promise<Seller[]|null>{
    return this.sellerService.deletedSellers();
  }

  @Query(returns => Seller)
  @UseGuards(GqlAuthGuard)
  async deletedSeller(@Args('where') where:SellerWhereUniqueInput):Promise<Seller|null>{
    return this.sellerService.deletedSeller(where.id);
  }

  @Query(returns=>Seller)
  @UseGuards(GqlAuthGuard)
  async restoreSeller(@Args('where') where:SellerWhereUniqueInput):Promise<Seller|null>{
    return this.sellerService.restoreSeller(where);
  }


}

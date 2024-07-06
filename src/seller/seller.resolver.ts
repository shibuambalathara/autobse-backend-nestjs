import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SellerService } from './seller.service';
import { Seller } from './models/seller.model';
import { CreateSellerInput } from './dto/create-seller.input';
import { UpdateSellerInput } from './dto/update-seller.input';
import { UniqueSellerInput } from './dto/unique-seller.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';

@Resolver(() => Seller)
export class SellerResolver {
  constructor(private readonly sellerService: SellerService) {}

  @Mutation(returns => Seller)
  @UseGuards(GqlAuthGuard)
  async createSeller(@Args('createSellerInput') createSellerInput: CreateSellerInput) {
    return this.sellerService.createSeller(createSellerInput);
  }

  @Query(returns => [Seller])
  async sellers() {
    return this.sellerService.sellers();
  }

  @Query(returns => Seller)
  async seller(@Args('where') where:UniqueSellerInput) {
    return this.sellerService.seller(where.id);
  }

  @Mutation(returns => Seller)
  @UseGuards(GqlAuthGuard)
  async updateSeller(@Args('where') where:UniqueSellerInput,@Args('updateSellerInput') updateSellerInput: UpdateSellerInput) {
    return this.sellerService.updateSeller(where.id,updateSellerInput);
  }

  @Mutation(returns => Seller)
  @UseGuards(GqlAuthGuard)
  async deleteSeller(@Args('where') where:UniqueSellerInput) {
    return this.sellerService.deleteSeller(where.id);
  }

  @Query(returns => [Seller])
  @UseGuards(GqlAuthGuard)
  async deletedSellers(){
    return this.sellerService.deletedSellers();
  }

  @Query(returns => Seller)
  @UseGuards(GqlAuthGuard)
  async deletedSeller(@Args('where') where:UniqueSellerInput){
    return this.sellerService.deletedSeller(where.id);
  }
}

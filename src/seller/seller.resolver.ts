import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { SellerService } from './seller.service';
import { Seller } from './models/seller.model';
import { CreateSellerInput } from './dto/create-seller.input';
import { UpdateSellerInput } from './dto/update-seller.input';
import { SellerWhereUniqueInput } from './dto/unique-seller.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/role/role.decorator';
import { RolesGuard } from 'src/role/role.guard';

@Resolver(() => Seller)
export class SellerResolver {
  constructor(private readonly sellerService: SellerService) {}

  @Mutation(returns => Seller)
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin','staff')
  async createSeller(@Args('createSellerInput') createSellerInput: CreateSellerInput,@Context() context):Promise<Seller|null> {
    const {id}=context.req.user   
    return this.sellerService.createSeller(id,createSellerInput);
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
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin','staff')
  async updateSeller(@Args('where') where:SellerWhereUniqueInput,@Args('updateSellerInput') updateSellerInput: UpdateSellerInput):Promise<Seller|null> {
    return this.sellerService.updateSeller(where.id,updateSellerInput);
  }

  @Mutation(returns => Seller)
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin')
  async deleteSeller(@Args('where') where:SellerWhereUniqueInput):Promise<Seller|null> {
    return this.sellerService.deleteSeller(where.id);
  }

  @Query(returns => [Seller])
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin')
  async deletedSellers():Promise<Seller[]|null>{
    return this.sellerService.deletedSellers();
  }

  @Query(returns => Seller)
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin')
  async deletedSeller(@Args('where') where:SellerWhereUniqueInput):Promise<Seller|null>{
    return this.sellerService.deletedSeller(where.id);
  }

  @Mutation(returns=>Seller)
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin')
  async restoreSeller(@Args('where') where:SellerWhereUniqueInput):Promise<Seller|null>{
    return this.sellerService.restoreSeller(where);
  }

// temp for test purpose
  @Mutation(returns => Seller)
  // @UseGuards(GqlAuthGuard,RolesGuard)
  // @Roles('admin')
  async deleteSellerHardDelete(@Args('where') where:SellerWhereUniqueInput):Promise<Seller|null> {
    return this.sellerService.deleteSellerHardDelete(where.id);
  }

}

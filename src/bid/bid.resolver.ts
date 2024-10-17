import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { BidService } from './bid.service';
import { Bid } from './models/bid.model';
import { CreateBidInput } from './dto/create-bid.input';
import { UpdateBidInput } from './dto/update-bid.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { BidWhereUniqueInput } from './dto/unique-bid.input';

@Resolver(() => Bid)
export class BidResolver {
  constructor(private readonly bidService: BidService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Bid)
  async createBid( @Context() context,
  @Args('bidVehicleId') bidVehicleId:string,
  @Args('createBidInput') createBidInput: CreateBidInput) :Promise<Bid|null>{
    const {id}=context.req.user
    return this.bidService.createBid(id,bidVehicleId,createBidInput);
  }

  @Query(() => [Bid])
  async Bids() {
    return this.bidService.findAll();
  }

  @Query(() => Bid)
  async Bid(@Args('where') where:BidWhereUniqueInput) {
    return this.bidService.findOne(where);
  }

  @Mutation(() => Bid)
  async updateBid(@Args('where') where:BidWhereUniqueInput,@Args('updateBidInput') updateBidInput: UpdateBidInput) {
    return this.bidService.update(where,updateBidInput);
  }

  @Mutation(() => Bid)
  async deleteBid(@Args('where') where:BidWhereUniqueInput) {
    return this.bidService.deleteBid(where);
  }
}

import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { BidService } from './bid.service';
import { Bid } from './models/bid.model';
import { CreateBidInput } from './dto/create-bid.input';
import { UpdateBidInput } from './dto/update-bid.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { RedisService } from 'src/services/redis/redis.service';

@Resolver(() => Bid)
export class BidResolver {
  constructor(
    private readonly bidService: BidService,
    private readonly redisService: RedisService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Bid)
  async createBid( @Context() context,
  @Args('bidVehicleId') bidVehicleId:string,
  @Args('createBidInput') createBidInput: CreateBidInput) :Promise<Bid|null>{
    const {id}=context.req.user
    const bid = await this.bidService.createBid(id,bidVehicleId,createBidInput);
    this.redisService.publish('BID_CREATION',{bidCreation: bid})
    return bid
  }

  // @Query(() => [Bid])
  // async Bids() {
  //   return this.bidService.findAll();
  // }

  @Query(() => Bid)
  async Bid(@Args('id') id: string) {
    return this.bidService.findOne(id);
  }

  @Mutation(() => Bid)
  async updateBid(@Args('id') id:string,@Args('updateBidInput') updateBidInput: UpdateBidInput) {
    return this.bidService.update(id,updateBidInput);
  }

  @Mutation(() => Bid)
  async deleteBid(@Args('id') id: string) {
    return this.bidService.deleteBid(id);
  }
}

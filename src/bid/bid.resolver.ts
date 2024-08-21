import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BidService } from './bid.service';
import { Bid } from './models/bid.model';
import { CreateBidInput } from './dto/create-bid.input';
import { UpdateBidInput } from './dto/update-bid.input';

@Resolver(() => Bid)
export class BidResolver {
  constructor(private readonly bidService: BidService) {}

  @Mutation(() => Bid)
  async createBid(@Args('userId') userId:string,@Args('bidVehicleId') bidVehicleId:string,@Args('createBidInput') createBidInput: CreateBidInput) :Promise<Bid|null>{
    return this.bidService.createBid(userId,bidVehicleId,createBidInput);
  }

  @Query(() => [Bid])
  async Bids() {
    return this.bidService.findAll();
  }

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

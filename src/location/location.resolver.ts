import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LocationService } from './location.service';

import { CreateLocationInput } from './dto/create-location.input';
import { UpdateLocationInput } from './dto/update-location.input';
import { Location } from './models/location.model';
import { UniqueLocationInput } from './dto/unique-location.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';

@Resolver(() => Location)
export class LocationResolver {
  constructor(private readonly locationService: LocationService) {}

  @Mutation(returns => Location)
  @UseGuards(GqlAuthGuard)
  async createLocation(@Args('stateId') stateId:string, @Args('createLocationInput') createLocationInput: CreateLocationInput) {
    return this.locationService.createLocation(stateId,createLocationInput);
  }

  @Query(returns=> [Location])
  async locations() {
    return this.locationService.locations();
  }

  @Query(returns => Location)
  async location(@Args('where') where:UniqueLocationInput) {
    return this.locationService.location(where.id);
  }

  @Mutation(returns => Location)
  @UseGuards(GqlAuthGuard)
  async updateLocation(@Args('where') where:UniqueLocationInput,@Args('updateLocationInput') updateLocationInput: UpdateLocationInput) {
    return this.locationService.updateLocation(where.id, updateLocationInput);
  }

  @Mutation(returns => Location)
  @UseGuards(GqlAuthGuard)
  async deleteLocation(@Args('where') where: UniqueLocationInput) {
    return this.locationService.deleteLocation(where.id);
  }

  @Query(returns => [Location])
  @UseGuards(GqlAuthGuard)
  async deletedLocations(){
    return this.locationService.deletedLocations();
  }

  @Query(returns => Location)
  @UseGuards(GqlAuthGuard)
  async deletedLocation(@Args('where') where:UniqueLocationInput){
    return this.locationService.deletedLocation(where.id);

  }

}

import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LocationService } from './location.service';

import { CreateLocationInput } from './dto/create-location.input';
import { UpdateLocationInput } from './dto/update-location.input';
import { Location } from './models/location.model';
import { LocationWhereUniqueInput } from './dto/unique-location.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';

@Resolver(() => Location)
export class LocationResolver {
  constructor(private readonly locationService: LocationService) {}

  @Mutation(returns => Location)
  @UseGuards(GqlAuthGuard)
  async createLocation(@Args('userId') userId:string,@Args('stateId') stateId:string, @Args('createLocationInput') createLocationInput: CreateLocationInput):Promise<Location|null> {
    return this.locationService.createLocation(userId,stateId,createLocationInput);
  }

  @Query(returns=> [Location])
  async locations():Promise<Location[]|null> {
    return this.locationService.locations();
  }

  @Query(returns => Location)
  async location(@Args('where') where:LocationWhereUniqueInput):Promise<Location|null> {
    return this.locationService.location(where);
  }

  @Mutation(returns => Location)
  @UseGuards(GqlAuthGuard)
  async updateLocation(@Args('where') where:LocationWhereUniqueInput,@Args('updateLocationInput') updateLocationInput: UpdateLocationInput):Promise<Location|null> {
    return this.locationService.updateLocation(where.id, updateLocationInput);
  }

  @Mutation(returns => Location)
  @UseGuards(GqlAuthGuard)
  async deleteLocation(@Args('where') where: LocationWhereUniqueInput):Promise<Location|null> {
    return this.locationService.deleteLocation(where.id);
  }

  @Query(returns => [Location])
  @UseGuards(GqlAuthGuard)
  async deletedLocations():Promise<Location[]|null>{
    return this.locationService.deletedLocations();
  }

  @Query(returns => Location)
  @UseGuards(GqlAuthGuard)
  async deletedLocation(@Args('where') where:LocationWhereUniqueInput):Promise<Location|null>{
    return this.locationService.deletedLocation(where.id);

  }

}

import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { LocationService } from './location.service';

import { CreateLocationInput } from './dto/create-location.input';
import { UpdateLocationInput } from './dto/update-location.input';
import { Location } from './models/location.model';
import { LocationWhereUniqueInput } from './dto/unique-location.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/role/role.decorator';
import { RolesGuard } from 'src/role/role.guard';

@Resolver(() => Location)
export class LocationResolver {
  constructor(private readonly locationService: LocationService) {}

  @Mutation(returns => Location)
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin','staff')
  async createLocation(@Args('createLocationInput') createLocationInput: CreateLocationInput ,@Context() context):Promise<Location|null> {
    const {id}=context.req.user   
    return this.locationService.createLocation(id,createLocationInput);
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
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin')
  async updateLocation(@Args('where') where:LocationWhereUniqueInput,@Args('updateLocationInput') updateLocationInput: UpdateLocationInput):Promise<Location|null> {
    return this.locationService.updateLocation(where.id, updateLocationInput);
  }

  @Mutation(returns => Location)
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin')
  async deleteLocation(@Args('where') where: LocationWhereUniqueInput):Promise<Location|null> {
    return this.locationService.deleteLocation(where.id);
  }

  @Query(returns => [Location])
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin')
  async deletedLocations():Promise<Location[]|null>{
    return this.locationService.deletedLocations();
  }

  @Query(returns => Location)
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin')
  async deletedLocation(@Args('where') where:LocationWhereUniqueInput):Promise<Location|null>{
    return this.locationService.deletedLocation(where.id);
  }

  @Mutation(returns=>Location)
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin')
  async restoreLocation(@Args('where') where:LocationWhereUniqueInput):Promise<Location|null>{
    return this.locationService.restoreLocation(where);
  }

}

import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { VehicleService } from './vehicle.service';
import { Vehicle } from './models/vehicle.model';
import { CreateVehicleInput } from './dto/create-vehicle.input';
import { UpdateVehicleInput } from './dto/update-vehicle.input';
import { VehicleWhereUniqueInput } from './dto/unique-vehicle.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';

@Resolver(() => Vehicle)
export class VehicleResolver {
  constructor(private readonly vehicleService: VehicleService) {}

  @Mutation(returns => Vehicle)
  @UseGuards(GqlAuthGuard)
  async createVehicle(@Args('userId') userId:string,@Args('createdBy') createdBy:string, @Args('createVehicleInput') createVehicleInput: CreateVehicleInput):Promise<Vehicle|null> {
    return this.vehicleService.createVehicle(userId,createdBy,createVehicleInput);
  }

  @Query(returns => [Vehicle])
  async vehicles() :Promise<Vehicle[]|null>{
    return this.vehicleService.vehicles();
  }

  @Query(returns => Vehicle)
  async vehicle(@Args('where') where:VehicleWhereUniqueInput):Promise<Vehicle|null> {
    return this.vehicleService.vehicle(where);
  }

  @Mutation(returns => Vehicle)
  @UseGuards(GqlAuthGuard)
  updateVehicle(@Args('where') where:VehicleWhereUniqueInput,@Args('updateVehicleInput') updateVehicleInput: UpdateVehicleInput):Promise<Vehicle|null> {
    return this.vehicleService.updateVehicle(where.id,updateVehicleInput);
  }

  @Mutation(returns => Vehicle)
  @UseGuards(GqlAuthGuard)
  async deleteVehicle(@Args('where') where:VehicleWhereUniqueInput):Promise<Vehicle|null> {
    return this.vehicleService.deleteVehicle(where.id);
  }

  @Query(returns => [Vehicle])
  @UseGuards(GqlAuthGuard)
  async deletedVehicles():Promise<Vehicle[]|null>{
    return this.vehicleService.deletedVehicles();
  }

  @Query(returns => Vehicle)
  @UseGuards(GqlAuthGuard)
  async deletedVehicle(@Args('where') where:VehicleWhereUniqueInput):Promise<Vehicle|null>{
    return this.vehicleService.deletedVehicle(where.id);
  }

  @Query(returns => Vehicle)
  @UseGuards(GqlAuthGuard)
  async restorevehicle(@Args('where') where:VehicleWhereUniqueInput):Promise<Vehicle|null>{
    return this.vehicleService.restoreVehicle(where);
  }
}

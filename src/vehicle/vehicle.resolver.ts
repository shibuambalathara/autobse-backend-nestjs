import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { VehicleService } from './vehicle.service';
import { Vehicle } from './models/vehicle.model';
import { CreateVehicleInput } from './dto/create-vehicle.input';
import { UpdateVehicleInput } from './dto/update-vehicle.input';
import { UniqueVehicleInput } from './dto/unique-vehicle.input';

@Resolver(() => Vehicle)
export class VehicleResolver {
  constructor(private readonly vehicleService: VehicleService) {}

  @Mutation(returns => Vehicle)
  async createVehicle(@Args('userId') userId:string, @Args('createVehicleInput') createVehicleInput: CreateVehicleInput) {
    return this.vehicleService.createVehicle(userId,createVehicleInput);
  }

  @Query(returns => [Vehicle])
  async vehicles() {
    return this.vehicleService.vehicles();
  }

  @Query(returns => Vehicle)
  async vehicle(@Args('where') where:UniqueVehicleInput) {
    return this.vehicleService.vehicle(where.id);
  }

  @Mutation(returns => Vehicle)
  updateVehicle(@Args('where') where:UniqueVehicleInput,@Args('updateVehicleInput') updateVehicleInput: UpdateVehicleInput) {
    return this.vehicleService.updateVehicle(where.id,updateVehicleInput);
  }

  @Mutation(returns => Vehicle)
  async deleteVehicle(@Args('where') where:UniqueVehicleInput) {
    return this.vehicleService.deleteVehicle(where.id);
  }

  @Query(returns => [Vehicle])
  async deletedVehicles(){
    return this.vehicleService.deletedVehicles();
  }

  @Query(returns => Vehicle)
  async deletedVehicle(@Args('where') where:UniqueVehicleInput){
    return this.vehicleService.deletedVehicle(where.id);
  }
}

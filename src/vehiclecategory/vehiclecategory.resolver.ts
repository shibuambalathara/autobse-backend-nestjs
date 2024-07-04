import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { VehiclecategoryService } from './vehiclecategory.service';
import { VehicleCategory } from './models/vehiclecategory.model';
import { CreateVehiclecategoryInput } from './dto/create-vehiclecategory.input';
import { UpdateVehiclecategoryInput } from './dto/update-vehiclecategory.input';
import { UniqueVehicleCategoryInput } from './dto/unique-vehiclecategory.input';

@Resolver(() => VehicleCategory)
export class VehiclecategoryResolver {
  constructor(private readonly vehiclecategoryService: VehiclecategoryService) {}

  @Mutation(returns => VehicleCategory)
  async createVehiclecategory(@Args('createVehiclecategoryInput') createVehiclecategoryInput: CreateVehiclecategoryInput) {
    return this.vehiclecategoryService.createVehicleCategory(createVehiclecategoryInput);
  }

  @Query(returns => [VehicleCategory])
  async vehicleCategories() {
    return this.vehiclecategoryService.vehicleCategories();
  }

  @Query(returns => VehicleCategory)
  async vehicleCategory(@Args('where') where:UniqueVehicleCategoryInput) {
    return this.vehiclecategoryService.vehicleCategory(where.id);
  }

  @Mutation(returns => VehicleCategory)
  async updateVehicleCategory(@Args('where') where:UniqueVehicleCategoryInput,@Args('updateVehiclecategoryInput') updateVehiclecategoryInput: UpdateVehiclecategoryInput) {
    return this.vehiclecategoryService.updateVehicleCategory(where.id,updateVehiclecategoryInput);
  }

  @Mutation(returns => VehicleCategory)
  async deleteVehiclecategory(@Args('where') where:UniqueVehicleCategoryInput) {
    return this.vehiclecategoryService.deleteVehicleCategory(where.id);
  }

  @Query(returns=> [VehicleCategory])
  async deletedVehicleCategories(){
    return this.vehiclecategoryService.deletedVehicleCategories()
  }

  @Query(returns => VehicleCategory)
  async deletedVehicleCategory(@Args('where') where:UniqueVehicleCategoryInput){
    return this.vehiclecategoryService.deletedVehicleCategory(where.id)
  }
}

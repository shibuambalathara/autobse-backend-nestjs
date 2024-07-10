import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { VehiclecategoryService } from './vehiclecategory.service';
import { VehicleCategory } from './models/vehiclecategory.model';
import { CreateVehiclecategoryInput } from './dto/create-vehiclecategory.input';
import { UpdateVehiclecategoryInput } from './dto/update-vehiclecategory.input';
import { VehicleCategoryWhereUniqueInput } from './dto/unique-vehiclecategory.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';

@Resolver(() => VehicleCategory)
export class VehiclecategoryResolver {
  constructor(private readonly vehiclecategoryService: VehiclecategoryService) {}

  @Mutation(returns => VehicleCategory)
  @UseGuards(GqlAuthGuard)
  async createVehiclecategory(@Args('userId') userId:string,@Args('createVehiclecategoryInput') createVehiclecategoryInput: CreateVehiclecategoryInput):Promise<VehicleCategory|null> {
    return this.vehiclecategoryService.createVehicleCategory(userId,createVehiclecategoryInput);
  }

  @Query(returns => [VehicleCategory])
  async vehicleCategories() :Promise<VehicleCategory[]|null>{
    return this.vehiclecategoryService.vehicleCategories();
  }

  @Query(returns => VehicleCategory)
  async vehicleCategory(@Args('where') where:VehicleCategoryWhereUniqueInput) :Promise<VehicleCategory|null>{
    return this.vehiclecategoryService.vehicleCategory(where);
  }

  @Mutation(returns => VehicleCategory)
  @UseGuards(GqlAuthGuard)
  async updateVehicleCategory(@Args('where') where:VehicleCategoryWhereUniqueInput,@Args('updateVehiclecategoryInput') updateVehiclecategoryInput: UpdateVehiclecategoryInput):Promise<VehicleCategory|null> {
    return this.vehiclecategoryService.updateVehicleCategory(where.id,updateVehiclecategoryInput);
  }

  @Mutation(returns => VehicleCategory)
  @UseGuards(GqlAuthGuard)
  async deleteVehiclecategory(@Args('where') where:VehicleCategoryWhereUniqueInput):Promise<VehicleCategory|null> {
    return this.vehiclecategoryService.deleteVehicleCategory(where.id);
  }

  @Query(returns=> [VehicleCategory])
  @UseGuards(GqlAuthGuard)
  async deletedVehicleCategories():Promise<VehicleCategory[]|null>{
    return this.vehiclecategoryService.deletedVehicleCategories()
  }

  @Query(returns => VehicleCategory)
  @UseGuards(GqlAuthGuard)
  async deletedVehicleCategory(@Args('where') where:VehicleCategoryWhereUniqueInput):Promise<VehicleCategory|null>{
    return this.vehiclecategoryService.deletedVehicleCategory(where.id)
  }

  @Query(returns=>VehicleCategory)
  @UseGuards(GqlAuthGuard)
  async restoreVehicleCategory(@Args('where') where:VehicleCategoryWhereUniqueInput):Promise<VehicleCategory|null>{
    return this.vehiclecategoryService.restoreVehicleCategory(where.id);
  }

}

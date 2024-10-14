import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { VehicleService } from './vehicle.service';
import { Vehicle } from './models/vehicle.model';
import { CreateVehicleInput } from './dto/create-vehicle.input';
import { UpdateVehicleInput } from './dto/update-vehicle.input';
import { VehicleWhereUniqueInput } from './dto/unique-vehicle.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/role/role.decorator';
import { RolesGuard } from 'src/role/role.guard';
import { VehicleListResponse } from './models/vehicleListModel';
import { RedisService } from 'src/services/redis/redis.service';

@Resolver(() => Vehicle)
export class VehicleResolver {
  constructor(
    private readonly vehicleService: VehicleService,
    private readonly redisService: RedisService,
  ) {}

  @Mutation((returns) => Vehicle)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('admin', 'staff')
  async createVehicle(
    // @Args('userId') userId:string,
    @Args('eventId') eventId: string,
    @Args('createVehicleInput') createVehicleInput: CreateVehicleInput,
    @Context() context,
  ): Promise<Vehicle | null> {
    if (
      !createVehicleInput.registrationNumber ||
      !createVehicleInput.loanAgreementNo
    ) {
      throw new Error(
        'Both registrationNumber and loanAgreementNo are required fields',
      );
    }
    const { id } = context.req.user;
    return this.vehicleService.createVehicle(id, eventId, createVehicleInput);
  }

  // @Mutation(returns=>Vehicle)
  // async listVehicle(@Args('eventId') eventId: string) {
  //   return this.vehicleService.listVehicle(eventId);
  // }

  @Query(() => VehicleListResponse, { nullable: true })
  async vehicles(): Promise<VehicleListResponse | null> {
    return this.vehicleService.vehicles();
  }

  @Query((returns) => Vehicle)
  async vehicle(
    @Args('where') where: VehicleWhereUniqueInput,
  ): Promise<Vehicle | null> {
    return this.vehicleService.vehicle(where);
  }

  @Mutation((returns) => Vehicle)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('admin')
  async updateVehicle(
    @Args('where') where: VehicleWhereUniqueInput,
    @Args('updateVehicleInput') updateVehicleInput: UpdateVehicleInput,
  ): Promise<Vehicle | null> {
    const vehicle = await this.vehicleService.updateVehicle(where.id, updateVehicleInput);
    this.redisService.publish('ALL_TOPICS',{allTopics: vehicle})
    return vehicle
  }

  @Mutation((returns) => Vehicle)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteVehicle(
    @Args('where') where: VehicleWhereUniqueInput,
  ): Promise<Vehicle | null> {
    return this.vehicleService.deleteVehicle(where.id);
  }

  @Query((returns) => [Vehicle])
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('admin')
  async deletedVehicles(): Promise<Vehicle[] | null> {
    return this.vehicleService.deletedVehicles();
  }

  @Query((returns) => Vehicle)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('admin')
  async deletedVehicle(
    @Args('where') where: VehicleWhereUniqueInput,
  ): Promise<Vehicle | null> {
    return this.vehicleService.deletedVehicle(where.id);
  }

  @Mutation((returns) => Vehicle)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('admin')
  async restorevehicle(
    @Args('where') where: VehicleWhereUniqueInput,
  ): Promise<Vehicle | null> {
    return this.vehicleService.restoreVehicle(where);
  }

  @Query(() => Int)
  async vehiclsCount(): Promise<number> {
  return this.vehicleService.countVehicles();
  }
}

import { Args, Context, Int, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Event } from "../models/event.model";
import { EventOrderByInput } from "../dto/EventOrderByInput";
import { EventWhereUniqueInput } from "../dto/unique-event.input";
import { LiveEventService } from "./liveEvent.service";
import { Vehicle } from "src/vehicle/models/vehicle.model";
import { VehicleOrderByInput } from "src/vehicle/dto/vehicleOrderByInput";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "src/auth/jwt-auth.guard";

@Resolver(() => Event)
export class LiveEventResolver {
  constructor(private readonly LiveEventService: LiveEventService) {}
  @Query(() => [Event], { nullable: true })
  async liveEvents(@Args('where',{nullable:true}) where: EventWhereUniqueInput,
  @Args('orderBy', { type: () => [EventOrderByInput], nullable: true }) orderBy?: EventOrderByInput[],
  @Args('take', { type: () => Int, nullable: true }) take?: number,
  @Args('skip', { type: () => Int, nullable: true }) skip?: number

)
   : Promise<Event[]|null>{
    return this.LiveEventService.liveEvents(where,orderBy,take,skip);
  }
  // ----------------------
  // @UseGuards(GqlAuthGuard)
  // @ResolveField(() => [Vehicle])
  // async vehiclesLive(
  //   @Parent() event: Event,
  //   @Context() context,
  //   @Args('orderBy', { type: () => [VehicleOrderByInput], nullable: true }) orderBy?: VehicleOrderByInput[],
  //   @Args('take', { type: () => Int, nullable: true }) take?: number,
  //   @Args('skip', { type: () => Int, nullable: true }) skip?: number
  // ): Promise<Vehicle[]> {
    
      
      
  //     // id}=context.req.user
  // // const id='cm2hd4lz10000cvhn70w7gc0c'
  //   const liveVehicles=await this.LiveEventService.getVehicles(event.id,orderBy, take, skip);
  //   // console.log("live vehicles",liveVehicles)
  //   return liveVehicles
  // }
}
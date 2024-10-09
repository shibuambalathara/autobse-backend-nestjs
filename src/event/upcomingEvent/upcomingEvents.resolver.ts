import { Args, Int, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Event } from "../models/event.model";
import { EventOrderByInput } from "../dto/EventOrderByInput";
import { EventWhereUniqueInput } from "../dto/unique-event.input";
import { Vehicle } from "src/vehicle/models/vehicle.model";
import { VehicleOrderByInput } from "src/vehicle/dto/vehicleOrderByInput";
import { UpcomingEventService } from "./upcomingEvents.service";

@Resolver(() => Event)
export class UpcomingEventResolver {
  constructor(private readonly UpcomingEventService: UpcomingEventService) {}
  @Query(() => [Event], { nullable: true })
  async upcomingEvents(@Args('where',{nullable:true}) where: EventWhereUniqueInput,
  @Args('orderBy', { type: () => [EventOrderByInput], nullable: true }) orderBy?: EventOrderByInput[],
  @Args('take', { type: () => Int, nullable: true }) take?: number,
  @Args('skip', { type: () => Int, nullable: true }) skip?: number

)
   : Promise<Event[]|null>{
    return this.UpcomingEventService.upcomingEvents(where,orderBy,take,skip);
  }
  // ----------------------
  @ResolveField(() => [Vehicle])
  async vehicles(
    @Parent() event: Event,
     @Args('orderBy', { type: () => [VehicleOrderByInput], nullable: true }) orderBy?: VehicleOrderByInput[],
    @Args('take', { type: () => Int, nullable: true }) take?: number,
    @Args('skip', { type: () => Int, nullable: true }) skip?: number
  ): Promise<Vehicle[]> {
    return this.UpcomingEventService.getVehicles(event.id,orderBy, take, skip);
  }
}
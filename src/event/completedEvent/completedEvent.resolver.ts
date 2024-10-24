import { Args, Int, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Event } from "../models/event.model";
import { EventOrderByInput } from "../dto/EventOrderByInput";
import { EventWhereUniqueInput } from "../dto/unique-event.input";
import { CompletedEventService } from "./completedEvent.service"; 
import { Vehicle } from "src/vehicle/models/vehicle.model";
import { VehicleOrderByInput } from "src/vehicle/dto/vehicleOrderByInput";

@Resolver(() => Event)
export class CompletedEventResolver {
  constructor(private readonly completedEventService: CompletedEventService) {}
  @Query(() => [Event], { nullable: true })
  async completedEvents(@Args('where',{nullable:true}) where: EventWhereUniqueInput,
  @Args('orderBy', { type: () => [EventOrderByInput], nullable: true }) orderBy?: EventOrderByInput[],
  @Args('take', { type: () => Int, nullable: true }) take?: number,
  @Args('skip', { type: () => Int, nullable: true }) skip?: number

)
   : Promise<Event[]|null>{
    return this.completedEventService.completedEvents(where,orderBy,take,skip);
  }
  
}
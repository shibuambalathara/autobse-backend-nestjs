import { Resolver, Query, Mutation, Args, Int, Context, ResolveField, Parent } from '@nestjs/graphql';
import { EventService } from './event.service';
import { Event } from './models/event.model';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/role.decorator';
import { EventWhereUniqueInput } from './dto/unique-event.input'
import { Vehicle } from 'src/vehicle/models/vehicle.model';
import { EventOrderByInput } from './dto/EventOrderByInput';
import { VehicleOrderByInput } from 'src/vehicle/dto/vehicleOrderByInput';
import GraphQLJSON from 'graphql-type-json';
import { AcrService } from 'src/acr/acr.service';
import { QueryOptionsType } from './queryOptions';
import { EventListResponse } from './models/eventListModel';



@Resolver(() => Event)
export class EventResolver {
  constructor(private readonly eventService: EventService,private readonly acrService:AcrService) {}

  @Mutation(returns => Event)
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin','staff')
  async createEvent(@Args('sellerId') sellerId:string, @Args('vehicleCategoryId') vehicleCategoryId:string, @Args('locationId') locationId:string,@Args('createEventInput') createEventInput: CreateEventInput, @Context() context):Promise<Event|null> {
    const {id}=context.req.user   
    return this.eventService.createEvent(sellerId,vehicleCategoryId,locationId,id,createEventInput);
  }

  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin','staff','dealer')
  @Query(() => EventListResponse, { nullable: true })
  async events(@Args('where',{nullable:true}) where: EventWhereUniqueInput,
  @Args('orderBy', { type: () => [EventOrderByInput], nullable: true }) orderBy?: EventOrderByInput[],
  @Args('take', { type: () => Int, nullable: true }) take?: number,
  @Args('skip', { type: () => Int, nullable: true }) skip?: number,
  @Args('options', { type: () => QueryOptionsType, nullable: true }) options?: QueryOptionsType 
): Promise<EventListResponse | null>{
  if (options?.enabled === false) {
            return null; 
        }
    return this.eventService.events(where,orderBy,take,skip);
  }
  // ----------------------
  @UseGuards(GqlAuthGuard)
  @ResolveField(() => [Vehicle])
  async vehiclesLive(
    @Parent() event: Event,@Context() context,
     @Args('orderBy', { type: () => [VehicleOrderByInput], nullable: true }) orderBy?: VehicleOrderByInput[],
    @Args('take', { type: () => Int, nullable: true }) take?: number,
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
  ): Promise<Vehicle[]> {
    const {id} =context.req.user
    // Assuming you have a method to get vehicles in your EventService
    return this.eventService.getVehicles(event.id,orderBy, take, skip,id);
  }

// ..............................
  
  
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin','staff','dealer')
  @Query(returns => Event)
  async event(
    @Args('where') where: EventWhereUniqueInput,
    
  ) :Promise<Event|null>{
    return this.eventService.event(where);



  }








  
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin', 'staff')
  @Mutation(returns => Event)
  async updateEvent(@Args('where') where:EventWhereUniqueInput,@Args('updateEventInput') updateEventInput: UpdateEventInput):Promise<Event|null> {
    return this.eventService.updateEvent(where.id,updateEventInput);
  }

  
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin')
  @Mutation(returns => Event)
  async deleteEvent(@Args('where') where:EventWhereUniqueInput) :Promise<Event|null>{
    return this.eventService.deleteEvent(where.id);
  }

 
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin')
  @Query(returns => [Event])
  async deletedEvents():Promise<Event[]|null>{
    return this.eventService.deletedEvents();
  }

  
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin')
  @Query(returns => Event)
  async deletedEvent(@Args('where') where:EventWhereUniqueInput):Promise<Event|null>{
    return this.eventService.deletedEvent(where.id);
  }

  
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin')
  @Mutation(returns=>Event)
  async restoreEvent(@Args('where') where:EventWhereUniqueInput):Promise<Event|null>{
    return this.eventService.restoreEvent(where);
  }

  @Query(() => Int)
  async eventsCount(): Promise<number> {
  return this.eventService.countEvents();
  } 

  @ResolveField(() => GraphQLJSON, { nullable: true })
  async Report(@Parent() event: Event) {
    const report = await this.acrService.getAcr(event.id);
    return report;
  }

}

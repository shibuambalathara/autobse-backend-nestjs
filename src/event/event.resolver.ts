import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
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



@Resolver(() => Event)
export class EventResolver {
  constructor(private readonly eventService: EventService) {}

  @Mutation(returns => Event)
  @UseGuards(GqlAuthGuard,RolesGuard)
  @Roles('admin','staff')
  async createEvent(@Args('sellerId') sellerId:string, @Args('vehicleCategoryId') vehicleCategoryId:string, @Args('locationId') locationId:string,@Args('createEventInput') createEventInput: CreateEventInput, @Context() context):Promise<Event|null> {
    const {id}=context.req.user   
    return this.eventService.createEvent(sellerId,vehicleCategoryId,locationId,id,createEventInput);
  }

  
  @Query(returns => [Event])
  async events() : Promise<Event[]|null>{
    return this.eventService.events();
  }

  @Query(returns => Event)
  async event(@Args('where') where: EventWhereUniqueInput) :Promise<Event|null>{
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

}
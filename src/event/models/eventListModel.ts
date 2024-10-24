import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Event } from "./event.model";

@ObjectType() // Ensure this decorator is correctly applied
export class EventListResponse {
    @Field(() => [Event], { nullable: true })
    events: Event[]; // Make sure the field name matches your return type

    @Field(() => Int)
    vehiclesCount: number; // Total count of vehicles for the events

    @Field(() => Int, { nullable: true })
    upcomingEventCount?: number;

    @Field(() => Int, { nullable: true })
    liveEventCount?: number;

    @Field(() => Int, { nullable: true })
    totalEventsCount?: number;

    @Field(() => Int, { nullable: true })
    completedEventCount?: number;
}

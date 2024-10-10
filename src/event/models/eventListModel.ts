import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Event } from "./event.model";

ObjectType()
export class EventListResponse{

@Field(()=>[Event],{nullable:true})
event:Event[]

@Field(()=>Int)
vehiclesCount:number

}
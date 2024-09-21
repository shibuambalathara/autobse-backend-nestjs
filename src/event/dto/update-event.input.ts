import { CreateEventInput } from './create-event.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EventBidLockType, eventCategory, EventStatusType } from './event.category';

@InputType()
export class UpdateEventInput extends PartialType(CreateEventInput) {
  @Field(()=>eventCategory)
  @IsEnum(eventCategory)
  @IsString()
  eventCategory:eventCategory;

  @Field({nullable:true})
  startDate?:Date;

  @Field({nullable:true})
  endDate?:Date;

  @Field({nullable:true})
  pauseDate?:Date;

  @Field({nullable:true})
  pausedTotalTime?:number;

  @Field({nullable:true})
  sellerId?:string;

  @Field({nullable:true})
  vehicleCategoryId?:string;

  @Field({nullable:true})
  locationId?:string;

  @Field({nullable:true})
  noOfBids?:number;

  @Field({nullable:true})
  downloadableFile_filesize?:number;

  @Field({nullable:true})
  downloadableFile_filename?:string;

  @Field({nullable:true})
  termsAndConditions?:string;

  @Field({nullable:true})
  createdAt?:Date;

  @Field({nullable:true})
  updatedAt?:Date;

  @Field({nullable:true})
  extraTimeTrigerIn?:number;

  @Field({nullable:true})
  extraTime?:number;

  @Field({nullable:true})
  vehicleLiveTimeIn?:number;

  @Field({nullable:true})
  gapInBetweenVehicles?:number;

  @Field(()=>EventBidLockType)
  @IsOptional()
  @IsEnum(EventBidLockType)
  bidLock?:EventBidLockType;

  @Field(()=>EventStatusType)
  @IsOptional()
  @IsEnum(EventStatusType)
  status?:EventStatusType;
  

}

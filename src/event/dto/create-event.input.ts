import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EventBidLockType,EventStatusType } from '@prisma/client';
import { Seller } from 'src/seller/models/seller.model';
import { VehicleCategory } from 'src/vehiclecategory/models/vehiclecategory.model';
import { User } from 'src/user/models/user.model';

@InputType()
export class CreateEventInput {
  @Field({nullable:true})
  @IsString()
  eventCategory?:string;

  @Field()
  startDate:Date;

  @Field()
  endDate:Date;

  @Field({nullable:true})
  pauseDate?:Date;

  @Field({nullable:true})
  pausedTotalTime?:number;


  @Field()
  sellerId:string;




  @Field()
  vehicleCategoryId:string;

 

  @Field()
  locationId:string;

  @Field()
  noOfBids:number;

  @Field({nullable:true})
  downloadableFile_filesize?:number;

  @Field({nullable:true})
  downloadableFile_filename?:string;

  @Field()
  termsAndConditions:string;


  @Field()
  createdById:string;

  @Field({nullable:true})
  extraTimeTrigerIn?:number;

  @Field({nullable:true})
  extraTime?:number;

  @Field({nullable:true})
  vehicleLiveTimeIn?:number;

  @Field({nullable:true})
  gapInBetweenVehicles?:number;

  @Field({nullable:true})
  @IsOptional()
  @IsEnum(EventBidLockType)
  bidLock?:EventBidLockType = EventBidLockType.unlocked;

  @Field({nullable:true})
  @IsOptional()
  @IsEnum(EventStatusType)
  status?:EventStatusType = EventStatusType.active;



}

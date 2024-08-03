import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Seller } from 'src/seller/models/seller.model';
import { User } from 'src/user/models/user.model';
import { VehicleCategory } from 'src/vehiclecategory/models/vehiclecategory.model';



@ObjectType()
export class Event {
  @Field()
  id:string;

  @Field()
  eventNo:number;

  @Field({nullable:true})
  eventCategory?:string;

  @Field()
  startDate:Date;

  @Field()
  endDate:Date;

  @Field()
  firstVehicleEndDate:Date;

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

  @Field({nullable:true})
  createdAt?:Date;

  @Field({nullable:true})
  updatedAt?:Date;

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

}

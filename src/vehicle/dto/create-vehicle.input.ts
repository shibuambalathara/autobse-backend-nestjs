import { InputType, Int, Field } from '@nestjs/graphql';
import { IsDate, IsString } from 'class-validator';

@InputType()
export class CreateVehicleInput {
  @Field()
  @IsString()
  registrationNumber:string;

  @Field()
  bidTimeExpire:string;

  @Field()
  bidStartTime:string;

  @Field({nullable:true})
  bidAmountUpdate?:number;

  @Field({nullable:true})
  currentBidAmount?:number;

  @Field({nullable:true})
  startBidAmount?:number;

  // @Field()
  // currentBidUserId?:string;
 
  // @Field()
  // bidStatus?:string;

  @Field()
  @IsString()
  loanAgreementNo:string;

  @Field()
  @IsString()
  registeredOwnerName:string;

  @Field({nullable:true})
  quoteIncreament?:number;

  @Field()
  @IsString()
  make:string;

  @Field()
  @IsString()
  model: string ;

  @Field()
  @IsString()
  varient:string;

  @Field()
  categoty:string;

  @Field()
  fuel:string;
  
  @Field()
  type:string;

  @Field()
  rcStatus:string ;

  @Field({nullable:true})
  yearOfManufacture?:number;

  @Field({nullable:true})
  ownership ?:number;

  @Field({nullable:true})
  mileage ?:number;

  @Field({nullable:true})
  kmReading?:number;

  @Field()
  insuranceStatus:string;
  
  @Field()
  yardLocation:string;  
  
  @Field({nullable:true})
  startPrice?:number;
  
  @Field({nullable:true})
  reservePrice?:number;
  
  @Field({nullable:true})
  repoDt?:string;

  @Field()
  veicleLocation:string;
  
  @Field()
  vehicleRemarks:string;
  
  @Field()
  auctionManager:string;
  
  @Field()
  parkingCharges:string;
  
  @Field()
  insurance:string;
  
  @Field({nullable:true})
  insuranceValidTill?:string;

  @Field()
  tax:string;
  
  @Field({nullable:true})
  taxValidityDate?:string;

  @Field()
  fitness:string;
  
  @Field()
  permit:string;
  
  @Field()
  fitnessPermit:string;
  
  @Field()
  engineNo :string;
  
  @Field()
  chassisNo :string ;
  
  @Field()
  image :string;  
  
  @Field()
  inspectionLink:string;

  @Field()
  autobseContact:string;

  @Field()
  autobse_contact_person:string;

  @Field()
  vehicleCondition:string;

  @Field()
  powerSteering:string ;
  
  @Field() 
  shape:string;

  @Field()
  color:string;

  @Field()
  state:string;

  @Field()
  city:string;

  @Field()      
  area:string;

  @Field()
  paymentTerms:string;

  @Field({nullable:true})
  dateOfRegistration?:string;

  @Field()
  hypothication:string;

  @Field()
  climateControl:string;

  @Field({nullable:true})
  doorCount?:number;

  @Field()
  gearBox:string;

  @Field()
  buyerFees:string;

  @Field()
  rtoFine:string;

  @Field()
  parkingRate:string;

  @Field()
  approxParkingCharges:string ;


  @Field()
  clientContactPerson:string;
  

  @Field()
  clientContactNo:string ;

  @Field()
  additionalRemarks:string;
  
  @Field({nullable:true})
  lotNumber?:number;

}
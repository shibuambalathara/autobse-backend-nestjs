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

  @Field()
  bidAmountUpdate?:number;

  @Field()
  currentBidAmount?:number;

  @Field()
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

  @Field()
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

  @Field()
  yearOfManufacture?:number;

  @Field()
  ownership ?:number;

  @Field()
  mileage ?:number;

  @Field()
  kmReading?:number;

  @Field()
  insuranceStatus:string;
  
  @Field()
  yardLocation:string;  
  
  @Field()
  startPrice?:number;
  
  @Field()
  reservePrice?:number;
  
  @Field()
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
  
  @Field()
  insuranceValidTill?:string;

  @Field()
  tax:string;
  
  @Field()
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

  @Field()
  dateOfRegistration?:string;

  @Field()
  hypothication:string;

  @Field()
  climateControl:string;

  @Field()
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
  
  @Field()
  lotNumber?:number;

}

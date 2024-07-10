import { IsDate, IsOptional, IsString } from 'class-validator';
import { CreateVehicleInput } from './create-vehicle.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateVehicleInput extends PartialType(CreateVehicleInput) {
  @Field({nullable:true})
  @IsString()
  @IsOptional()
  registrationNumber?:string;

  @Field({nullable:true})
  bidTimeExpire?:string;

  @Field({nullable:true})
  bidStartTime?:string;

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

  @Field({nullable:true})
  @IsString()
  loanAgreementNo?:string;

  @Field({nullable:true})
  @IsString()
  registeredOwnerName?:string;

  @Field({nullable:true})
  quoteIncreament?:number;

  @Field({nullable:true})
  @IsString()
  make?:string;

  @Field({nullable:true})
  @IsString()
  model?: string ;

  @Field({nullable:true})
  @IsString()
  varient?:string;

  @Field({nullable:true})
  categoty?:string;

  @Field({nullable:true})
  fuel?:string;
  
  @Field({nullable:true})
  type?:string;

  @Field({nullable:true})
  rcStatus?:string ;

  @Field({nullable:true})
  yearOfManufacture?:number;

  @Field({nullable:true})
  ownership ?:number;

  @Field({nullable:true})
  mileage ?:number;

  @Field({nullable:true})
  kmReading?:number;

  @Field({nullable:true})
  insuranceStatus?:string;
  
  @Field({nullable:true})
  yardLocation?:string;  
  
  @Field({nullable:true})
  startPrice?:number;
  
  @Field({nullable:true})
  reservePrice?:number;
  
  @Field({nullable:true})
  repoDt?:string;

  @Field({nullable:true})
  veicleLocation?:string;
  
  @Field({nullable:true})
  vehicleRemarks?:string;
  
  @Field({nullable:true})
  auctionManager?:string;
  
  @Field({nullable:true})
  parkingCharges?:string;
  
  @Field({nullable:true})
  insurance?:string;
  
  @Field({nullable:true})
  insuranceValidTill?:string;

  @Field({nullable:true})
  tax?:string;
  
  @Field({nullable:true})
  taxValidityDate?:string;

  @Field({nullable:true})
  fitness?:string;
  
  @Field({nullable:true})
  permit?:string;
  
  @Field({nullable:true})
  fitnessPermit?:string;
  
  @Field({nullable:true})
  engineNo ?:string;
  
  @Field({nullable:true})
  chassisNo ?:string ;
  
  @Field({nullable:true})
  image ?:string;  
  
  @Field({nullable:true})
  inspectionLink?:string;

  @Field({nullable:true})
  autobseContact?:string;

  @Field({nullable:true})
  autobse_contact_person?:string;

  @Field({nullable:true})
  vehicleCondition?:string;

  @Field({nullable:true})
  powerSteering?:string ;
  
  @Field({nullable:true}) 
  shape?:string;

  @Field({nullable:true})
  color?:string;

  @Field({nullable:true})
  state?:string;

  @Field({nullable:true})
  city?:string;

  @Field({nullable:true})      
  area?:string;

  @Field({nullable:true})
  paymentTerms?:string;

  @Field({nullable:true})
  dateOfRegistration?:string;

  @Field({nullable:true})
  hypothication?:string;

  @Field({nullable:true})
  climateControl?:string;

  @Field({nullable:true})
  doorCount?:number;

  @Field({nullable:true})
  gearBox?:string;

  @Field({nullable:true})
  buyerFees?:string;

  @Field({nullable:true})
  rtoFine?:string;

  @Field({nullable:true})
  parkingRate?:string;

  @Field({nullable:true})
  approxParkingCharges?:string ;


  @Field({nullable:true})
  clientContactPerson?:string;
  

  @Field({nullable:true})
  clientContactNo?:string ;

  @Field({nullable:true})
  additionalRemarks?:string;
  
  @Field({nullable:true})
  lotNumber?:number;
}
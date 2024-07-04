import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Vehicle {
  @Field()
  registrationNumber:String;

  @Field()
  bidTimeExpire:Date;

  @Field()
  bidStartTime:Date;

  @Field()
  bidAmountUpdate:number;

  @Field()
  currentBidAmount:number;

  @Field()
  startBidAmount:number;
 
  @Field()
  bidStatus:string;

  @Field()
  loanAgreementNo:string;

  @Field()
  registeredOwnerName:string;

  @Field()
  quoteIncreament:number;

  @Field()
  make:String;

  @Field()
  model: String ;

  @Field()
  varient:String;

  @Field()
  categoty:String;

  @Field()
  fuel:String;
  
  @Field()
  type:String;

  @Field()
  rcStatus:String ;

  @Field()
  yearOfManufacture:number;

  @Field()
  ownership :number;

  @Field()
  mileage :number;

  @Field()
  kmReading:number;

  @Field()
  insuranceStatus:String;
  
  @Field()
  yardLocation:String;  
  
  @Field()
  startPrice:number;
  
  @Field()
  reservePrice:number;
  
  @Field()
  repoDt:Date;

  @Field()
  veicleLocation:String;
  
  @Field()
  vehicleRemarks:String;
  
  @Field()
  auctionManager:String;
  
  @Field()
  parkingCharges:String;
  
  @Field()
  insurance:String;
  
  @Field()
  insuranceValidTill:Date;

  @Field()
  tax:String;
  
  @Field()
  taxValidityDate:Date;

  @Field()
  fitness:String;
  
  @Field()
  permit:String;
  
  @Field()
  fitnessPermit:String;
  
  @Field()
  engineNo :String;
  
  @Field()
  chassisNo :String ;
  
  @Field()
  image :String;  
  
  @Field()
  inspectionLink:String;

  @Field()
  autobseContact:String;

  @Field()
  autobse_contact_person:String;

  @Field()
  vehicleCondition:String;

  @Field()
  powerSteering:String ;
  
  @Field() 
  shape:String;

  @Field()
  color:String;

  @Field()
  state:String;

  @Field()
  city:String;

  @Field()      
  area:String;

  @Field()
  paymentTerms:String;

  @Field()
  dateOfRegistration:Date;

  @Field()
  hypothication:String;

  @Field()
  climateControl:String;

  @Field()
  doorCount:number;

  @Field()
  gearBox:String;

  @Field()
  buyerFees:String;

  @Field()
  rtoFine:String;

  @Field()
  parkingRate:String;

  @Field()
  approxParkingCharges:String ;


  @Field()
  clientContactPerson:String;
  

  @Field()
  clientContactNo:String ;

  @Field()
  additionalRemarks: String;
  
  @Field()
  lotNumber:number;

                  

}

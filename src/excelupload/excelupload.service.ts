import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExceluploadInput } from './dto/create-excelupload.input';
import { UpdateExceluploadInput } from './dto/update-excelupload.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExcelUpload, Prisma } from '@prisma/client';
import * as XLSX from 'xlsx'; 
import { createReadStream } from 'fs';
import graphqlUploadExpress, { FileUpload } from 'graphql-upload/GraphQLUpload.mjs';
import { ExcelWhereUniqueInput } from './dto/unique-excelupload.input';
import { Excelupload } from './models/excelupload.model';


@Injectable()
export class ExceluploadService {
  constructor(private readonly prisma:PrismaService){}

  async createExcelUpload(id: string,userId:string,eventId:string,createExceluploadInput: CreateExceluploadInput): Promise<ExcelUpload|null|Boolean> {
  try{
   const excel = await this.prisma.excelUpload.create({
      data: {
        createdById: id,
        ...createExceluploadInput,
      
      },
    });

    const stream = createReadStream(await createExceluploadInput.file_filename);
    const buffers = [];
  
    for await (const chunk of stream) {
      buffers.push(chunk);
    }
    const buffer = Buffer.concat(buffers);
  
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { defval: null });
    

    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new Error('Event not found');
    }
    
    for (const row of data){
      const lastVehicle = await this.prisma.vehicle.findFirst({
        where: { eventId: eventId },
        orderBy: { bidTimeExpire: 'desc' }, 
      });

  
      let bidStartTime: Date;
      let bidTimeExpire: Date;
  
      if (!lastVehicle) {
        bidStartTime = new Date(event.startDate);
        bidTimeExpire = new Date(event.endDate);
      } 
      else {
        bidStartTime = new Date(event.startDate);
        const bidexpire = new Date(lastVehicle.bidTimeExpire);
        bidTimeExpire = new Date(bidexpire.getTime() + event.gapInBetweenVehicles * 60000);
      }
      const firstVehicle = await this.prisma.vehicle.findFirst({where: { eventId: eventId },orderBy: { bidTimeExpire: 'asc' }, });
            
      if (firstVehicle) {
        const firstEndDate = firstVehicle.bidTimeExpire;
        const event_data = await this.prisma.event.update({
          where: { id: eventId },
          data: { endDate: bidTimeExpire, firstVehicleEndDate: firstEndDate },
        });
      } 
     
      if (!row['Registration_Number'] || !row['Loan_Agreement_No']) {
        throw new Error('Both registrationNumber and loanAgreementNo are required fields');
      }
  
      await this.prisma.vehicle.create({
        data: {    
          createdById:id,
          currentBidUserId:userId,
          eventId:eventId,  
          bidStartTime:bidStartTime,
          bidTimeExpire:bidTimeExpire,
          registrationNumber  :row['Registration_Number'],          
          loanAgreementNo :row['Loan_Agreement_No'],       
          registeredOwnerName:row['Customer_Name'],    
          quoteIncreament :row['Quote_Increament'],       
          make            :row['Make'],      
          model           :row['Model'],      
          varient         :row['Variant'],
          category        :row['category'],      
          fuel            :row['Fuel'],
          type            :row['Type'],
          rcStatus        :row['RC_Status'],       
          YOM             :row['YOM'],      
          ownership        :row['Ownership'],
          mileage          :row['Mileage'],
          kmReading        :row['Km_Reading'],
          insuranceStatus  :row['Insurance_Status'],      
          yardLocation     :row['yard_Location'],
          startPrice       :row['Start_Price'], 
          reservePrice     :row['Reserve_Price'],
          repoDt           :row['Repo_Dt'],
          veicleLocation   :row['Veicle_Location'],     
          vehicleRemarks   :row['Vehicle_Remarks'],      
          auctionManager   :row['Auction_Manager'],      
          parkingCharges   :row['Parking_Charges']!== undefined ? row['Parking_Charges'].toString() : null,      
          insurance        :row['Insurance_Type'],    
          insuranceValidTill:row['Insurance_Expiry_Date']!== undefined ? row['Insurance_Expiry_Date'].toString() : null,
          tax               :row['Tax_Type']!== undefined ? row['Tax_Type'].toString() : null,     
          taxValidityDate   :row['Tax_Validity_Date'],
          fitness           :row['Fitness'],   
          permit            :row['Permit'],
          engineNo          :row['Engine_No'],     
          chassisNo         :row['Chassis_No'],
          image             :row['Image'],
          inspectionLink    :row['Inspection_Link'],    
          autobseContact    :row['Autobse_Contact']!== undefined ? row['Autobse_Contact'].toString() : null,    
          autobse_contact_person :row['Autobse_Contact_Person'],
          vehicleCondition   :row['Vehicle_Condition'],    
          powerSteering      :row['Power_ Steering'],    
          shape              :row['Shape'],    
          color              :row['Color'],
          state              :row['State'],    
          city               :row['City'],    
          area               :row['Area'],
          paymentTerms       :row['Payment_Terms'],    
          dateOfRegistration :row['Date_of_Registration'],   
          hypothication      :row['Hypothication'],    
          climateControl     :row['Climate_Control'], 
          doorCount          :row['Door_Count'],
          gearBox            :row['Gear_Box'], 
          buyerFees          :row['Buyer_Fees']!== undefined ? row['Buyer_Fees'].toString() : null,
          rtoFine            :row['RTO_Fine']!== undefined ? row['RTO_Fine'].toString() : null,
          parkingRate        :row['Parking_Rate']!== undefined ? row['Parking_Rate'].toString() : null,
          approxParkingCharges:row['Approx. Parking_ Charges']!== undefined ? row['Approx. Parking_ Charges'].toString() : null,   
          clientContactPerson :row['Client_Contact_Person'],
          clientContactNo     :row['Client_Contact_No']!== undefined ? row['Client_Contact_No'].toString() : null,
          additionalRemarks   :row['Additional_Remarks'],   
          lotNumber           :row['Lot_No']
        },
      });
    }
    return excel;
  }
  catch(error){
    throw new Error(error.message)
      }
  }

  async excelUploads():Promise<ExcelUpload[]|null> {
    const excel = await this.prisma.excelUpload.findMany({where:{isDeleted:false,}});
    if(!excel) throw new NotFoundException("Not Found");
    return excel;
  }

  async excelUpload(where:ExcelWhereUniqueInput) :Promise<Excelupload|null>{
    const excel = await this.prisma.excelUpload.findUnique({where:{...where as Prisma.ExcelUploadWhereUniqueInput,isDeleted:false}});
    if(!excel) throw new NotFoundException("Not Found");
    return excel;
  }


  async deleteExcelupload(id:string):Promise<Excelupload|null> {
    const excel = await this.prisma.excelUpload.findUnique({where:{id,isDeleted:false,}})
    if(!excel) throw new NotFoundException("Not Found");
    return await this.prisma.excelUpload.update({
        where:{id},
        data:{
          isDeleted:true,
        }
      });
    }
  

  async restoreExcelUpload(where:ExcelWhereUniqueInput):Promise<Excelupload|null>{
    const excel = await this.prisma.excelUpload.findUnique({where:{...where as Prisma.ExcelUploadWhereUniqueInput,isDeleted:true}});
    if(!excel) throw new NotFoundException("Not Found");
    return await this.prisma.excelUpload.update({
      where:{...where as Prisma.ExcelUploadWhereUniqueInput},
      data:{
        isDeleted:false,
      }
    });
  }

  }




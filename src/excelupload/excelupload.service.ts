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
      try{
      const lastVehicle = await this.prisma.vehicle.findFirst({
        where: { eventId: eventId },
        orderBy: { bidTimeExpire: 'desc' }, 
      });

  
      let bidStartTime: Date;
      let bidTimeExpire: Date;
  
      if (!lastVehicle) {
        bidStartTime = new Date(event.startDate);
        bidTimeExpire = new Date(event.endDate);
        await this.prisma.event.update({
              where: { id: eventId },
              data: { endDate: bidTimeExpire, firstVehicleEndDate:bidTimeExpire },
            });
      } 
      else {
        bidStartTime = new Date(event.startDate);
        const bidexpire = new Date(lastVehicle.bidTimeExpire);
        bidTimeExpire = new Date(bidexpire.getTime() + event.gapInBetweenVehicles * 60000);
      }
            
    
     
      if (!row['Registration_Number'] || !row['Loan_Agreement_No']) {
        throw new Error('Both registrationNumber and loanAgreementNo are required fields');
      }
  
      await this.prisma.vehicle.createMany({
        data: {    
          createdById:id,
          currentBidUserId:userId,
          eventId:eventId,  
          bidStartTime:bidStartTime,
          bidTimeExpire:bidTimeExpire,
          registrationNumber  :row['Registration_Number'],          
          loanAgreementNo :row['Loan_Agreement_No'],       
          registeredOwnerName:row['Customer_Name']??null,    
          quoteIncreament :row['Quote_Increament']??null,       
          make            :row['Make']??null,      
          model           :row['Model']??null,      
          varient         :row['Variant']??null,
          category        :row['Category']??null,      
          fuel            :row['Fuel']??null,
          type            :row['Type']??null,
          rcStatus        :row['RC_Status']??null,       
          YOM             :row['YOM']??null,      
          ownership        :row['Ownership']??null,
          mileage          :row['Mileage']??null,
          kmReading        :row['Km_Reading']??null,
          insuranceStatus  :row['Insurance_Status']??null,      
          yardLocation     :row['yard_Location']??null,
          startPrice       :row['Start_Price']??null, 
          reservePrice     :row['Reserve_Price']??null,
          repoDt           :row['Repo_Dt']??null,
          veicleLocation   :row['Veicle_Location']??null,     
          vehicleRemarks   :row['Vehicle_Remarks']??null,      
          auctionManager   :row['Auction_Manager']??null,      
          parkingCharges   :row['Parking_Charges']!== undefined ? row['Parking_Charges'].toString() : null,      
          insurance        :row['Insurance_Type']??null,    
          insuranceValidTill:row['Insurance_Expiry_Date']!== undefined ? row['Insurance_Expiry_Date'].toString() : null,
          tax               :row['Tax_Type']!== undefined ? row['Tax_Type'].toString() : null,     
          taxValidityDate   :row['Tax_Validity_Date']??null,
          fitness           :row['Fitness']??null,   
          permit            :row['Permit']??null,
          engineNo          :row['Engine_No']??null,     
          chassisNo         :row['Chassis_No']??null,
          image             :row['Image']??null,
          inspectionLink    :row['Inspection_Link'],    
          autobseContact    :row['Autobse_Contact']!== undefined ? row['Autobse_Contact'].toString() : null,    
          autobse_contact_person :row['Autobse_Contact_Person']??null,
          vehicleCondition   :row['Vehicle_Condition']??null,    
          powerSteering      :row['Power_ Steering']??null,    
          shape              :row['Shape']??null,    
          color              :row['Color']??null,
          state              :row['State']??null,    
          city               :row['City']??null,    
          area               :row['Area']??null,
          paymentTerms       :row['Payment_Terms']??null,    
          dateOfRegistration :row['Date_of_Registration']??null,   
          hypothication      :row['Hypothication']??null,    
          climateControl     :row['Climate_Control']??null, 
          doorCount          :row['Door_Count']??null,
          gearBox            :row['Gear_Box']??null, 
          buyerFees          :row['Buyer_Fees']!== undefined ? row['Buyer_Fees'].toString() : null,
          rtoFine            :row['RTO_Fine']!== undefined ? row['RTO_Fine'].toString() : null,
          parkingRate        :row['Parking_Rate']!== undefined ? row['Parking_Rate'].toString() : null,
          approxParkingCharges:row['Approx. Parking_ Charges']!== undefined ? row['Approx. Parking_ Charges'].toString() : null,   
          clientContactPerson :row['Client_Contact_Person']??null,
          clientContactNo     :row['Client_Contact_No']!== undefined ? row['Client_Contact_No'].toString() : null,
          additionalRemarks   :row['Additional_Remarks']??null,   
          lotNumber           :row['Lot_No']??null
        },
      });
    }
    catch (rowError) {
      console.error(`Error processing row: ${rowError.message}`);
    }
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




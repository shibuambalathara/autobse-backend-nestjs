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

  async createExcelUpload(
   
    id: string,
    userId:string,
    eventId:string,
    createExceluploadInput: CreateExceluploadInput
  ): Promise<ExcelUpload|null|Boolean> {
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
      
      
      const firstVehicle = await this.prisma.vehicle.findFirst({where: { eventId: eventId },orderBy: { bidTimeExpire: 'asc' }, });
      const firstEndDate =firstVehicle.bidTimeExpire;
  
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
      const event_data =await this.prisma.event.update({where:{id:eventId},data:{endDate:bidTimeExpire,firstVehicleEndDate:firstEndDate}});
      if (!row['registrationNumber'] || !row['loanAgreementNo']) {
        throw new Error('Both registrationNumber and loanAgreementNo are required fields');
      }
  
      await this.prisma.vehicle.create({
        data: {    
          createdById:id,
          currentBidUserId:userId,
          eventId:eventId,  
          bidStartTime:bidStartTime,
          bidTimeExpire:bidTimeExpire,
          registrationNumber  :row['registrationNumber'],     
          bidAmountUpdate :row['bidAmountUpdate'],       
          currentBidAmount:row['currentBidAmount'],   
          startBidAmount  :row['startBidAmount'],                              
          bidStatus       :row['bidStatus'],      
          loanAgreementNo :row['loanAgreementNo'],       
          registeredOwnerName:row['registeredOwnerName'],    
          quoteIncreament :row['quoteIncreament'],       
          make            :row['make'],      
          model           :row['model'],      
          varient         :row['varient'],
          categoty        :row['categoty'],      
          fuel            :row['fuel'],
          type            :row['type'],
          rcStatus        :row['rcStatus'],       
          YOM             :row['YOM'],      
          ownership        :row['ownership'],
          mileage          :row['mileage'],
          kmReading        :row['kmReading'],
          insuranceStatus  :row['insuranceStatus'],      
          yardLocation     :row['yardLocation'],
          startPrice       :row['startPrice'], 
          reservePrice     :row['reservePrice'],
          repoDt           :row['repoDt'],
          veicleLocation   :row['veicleLocation'],     
          vehicleRemarks   :row['vehicleRemarks'],      
          auctionManager   :row['auctionManager'],      
          parkingCharges   :row['parkingCharges']!== undefined ? row['parkingCharges'].toString() : null,      
          insurance        :row['insurance'],    
          insuranceValidTill:row['insuranceValidTill']!== undefined ? row['insuranceValidTill'].toString() : null,
          tax               :row['tax']!== undefined ? row['tax'].toString() : null,     
          taxValidityDate   :row['taxValidityDate'],
          fitness           :row['fitness'],   
          permit            :row['permit'],
          engineNo          :row['engineNo'],     
          chassisNo         :row['chassisNo'],
          image             :row['image'],
          inspectionLink    :row['inspectionLink'],    
          autobseContact    :row['autobseContact']!== undefined ? row['autobseContact'].toString() : null,    
          autobse_contact_person :row['autobse_contact_person'],
          vehicleCondition   :row['vehicleCondition'],    
          powerSteering      :row['powerSteering'],    
          shape              :row['shape'],    
          color              :row['color'],
          state              :row['state'],    
          city               :row['city'],    
          area               :row['area'],
          paymentTerms       :row['paymentTerms'],    
          dateOfRegistration :row['dateOfRegistration'],   
          hypothication      :row['hypothication'],    
          climateControl     :row['climateControl'], 
          doorCount          :row['doorCount'],
          gearBox            :row['gearBox'], 
          buyerFees          :row['buyerFees']!== undefined ? row['buyerFees'].toString() : null,
          rtoFine            :row['rtoFine']!== undefined ? row['rtoFine'].toString() : null,
          parkingRate        :row['parkingRate']!== undefined ? row['parkingRate'].toString() : null,
          approxParkingCharges:row['approxParkingCharges']!== undefined ? row['approxParkingCharges'].toString() : null,   
          clientContactPerson :row['clientContactPerson'],
          clientContactNo     :row['clientContactNo']!== undefined ? row['clientContactNo'].toString() : null,
          additionalRemarks   :row['additionalRemarks'],   
          lotNumber           :row['lotNumber']
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




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
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      //console.log(typeof(row[1],row[1],"need to get the type"));
      await this.prisma.vehicle.create({
        data: {      
          createdById:id,
          currentBidUserId:userId,
          eventId:eventId,
          registrationNumber  :row[0],  
          bidTimeExpire   :row[1],       
          bidStartTime    :row[2],   
          bidAmountUpdate :row[3],       
          currentBidAmount:row[4],   
          startBidAmount  :row[5],                              
          bidStatus       :row[6],      
          loanAgreementNo :row[7],       
          registeredOwnerName:row[8],    
          quoteIncreament :row[9],       
          make            :row[10],      
          model           :row[11],      
          varient         :row[12],
          categoty        :row[13],      
          fuel            :row[14],
          type            :row[15],
          rcStatus        :row[16],       
          YOM             :row[17],      
          ownership        :row[18],
          mileage          :row[19],
          kmReading        :row[20],
          insuranceStatus  :row[21],      
          yardLocation     :row[22],
          startPrice       :row[23], 
          reservePrice     :row[24],
          repoDt           :row[25],
          veicleLocation   :row[26],     
          vehicleRemarks   :row[27],      
          auctionManager   :row[28],      
          parkingCharges   :row[29]!== undefined ? row[29].toString() : null,      
          insurance        :row[30],    
          insuranceValidTill:row[31]!== undefined ? row[31].toString() : null,
          tax               :row[32]!== undefined ? row[32].toString() : null,     
          taxValidityDate   :row[33],
          fitness           :row[34],   
          permit            :row[35],
          engineNo          :row[36],     
          chassisNo         :row[37],
          image             :row[38],
          inspectionLink    :row[39],    
          autobseContact    :row[40]!== undefined ? row[40].toString() : null,    
          autobse_contact_person :row[41],
          vehicleCondition   :row[42],    
          powerSteering      :row[43],    
          shape              :row[44],    
          color              :row[45],
          state              :row[46],    
          city               :row[47],    
          area               :row[48],
          paymentTerms       :row[49],    
          dateOfRegistration :row[50],   
          hypothication      :row[51],    
          climateControl     :row[52], 
          doorCount          :row[53],
          gearBox            :row[54], 
          buyerFees          :row[55]!== undefined ? row[55].toString() : null,
          rtoFine            :row[56]!== undefined ? row[56].toString() : null,
          parkingRate        :row[57]!== undefined ? row[57].toString() : null,
          approxParkingCharges:row[58]!== undefined ? row[58].toString() : null,   
          clientContactPerson :row[59],
          clientContactNo     :row[60]!== undefined ? row[60].toString() : null,
          additionalRemarks   :row[61],   
          lotNumber           :row[62]
        },
      });
    }
    
    return excel;
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




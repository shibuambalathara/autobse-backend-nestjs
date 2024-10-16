import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { s3Service } from 'src/services/s3/s3.service';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { compressService } from 'src/services/compress/compress.service';
import { ConfigService } from '@nestjs/config';
import * as XLSX from 'xlsx';
import { CreateEventExcelUploadInput } from './dto/create-eventexcelupload.input';


@Injectable()
export class FileuploadService {
  constructor(
    private readonly s3Service: s3Service,
    private readonly compressService: compressService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) { }

  async uploadUpdateUserProfile(userId: string, files: {
    pancard_image?: [Express.Multer.File],
    aadharcard_front_image?: [Express.Multer.File],
    aadharcard_back_image?: [Express.Multer.File],
    driving_license_front_image?: [Express.Multer.File],
    driving_license_back_image?: [Express.Multer.File],
  }) {
    const userProfileFiles = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        pancard_image: true,
        aadharcard_front_image: true,
        aadharcard_back_image: true,
        driving_license_front_image: true,
        driving_license_back_image: true,
        firstName: true,
        lastName: true,
        status: true,
        id: true
      }
    })
    if (!userProfileFiles) throw new NotFoundException('User not found.')

    if (files.pancard_image && files.pancard_image.length) {
      files.pancard_image[0].buffer = await this.compressService.compressImage(files.pancard_image[0].buffer, files.pancard_image[0].fieldname)
      files.pancard_image[0].filename = userProfileFiles.pancard_image
    }

    if (files.aadharcard_front_image && files.aadharcard_front_image.length) {
      files.aadharcard_front_image[0].buffer = await this.compressService.compressImage(files.aadharcard_front_image[0].buffer, files.aadharcard_front_image[0].fieldname)
      files.aadharcard_front_image[0].filename = userProfileFiles.aadharcard_front_image
    }

    if (files.aadharcard_back_image && files.aadharcard_back_image.length) {
      files.aadharcard_back_image[0].buffer = await this.compressService.compressImage(files.aadharcard_back_image[0].buffer, files.aadharcard_back_image[0].fieldname)
      files.aadharcard_back_image[0].filename = userProfileFiles.aadharcard_back_image
    }

    if (files.driving_license_front_image && files.driving_license_front_image.length) {
      files.driving_license_front_image[0].buffer = await this.compressService.compressImage(files.driving_license_front_image[0].buffer, files.driving_license_front_image[0].fieldname)
      files.driving_license_front_image[0].filename = userProfileFiles.driving_license_front_image
    }

    if (files.driving_license_back_image && files.driving_license_back_image.length) {
      files.driving_license_back_image[0].buffer = await this.compressService.compressImage(files.driving_license_back_image[0].buffer, files.driving_license_back_image[0].fieldname)
      files.driving_license_back_image[0].filename = userProfileFiles.driving_license_back_image
    }

    const uploads: Map<string, string> = await this.uploadUserProfileFiles(files)

    if (uploads.size === 0) {
      throw new InternalServerErrorException('No files uploaded.')
    }
    return this.updateUserProfileDb(userId, uploads)
  }

  async uploadUserProfileFiles(files: {
    pancard_image?: [Express.Multer.File],
    aadharcard_front_image?: [Express.Multer.File],
    aadharcard_back_image?: [Express.Multer.File],
    driving_license_front_image?: [Express.Multer.File],
    driving_license_back_image?: [Express.Multer.File],
  }) {

    const result = new Map<string, string>()

    for (const [fieldName, file] of Object.entries(files)) {
      const [firstFile] = file
      const key: string = firstFile.filename ? firstFile.filename : randomUUID()
      const res = await this.s3Service.uploadFile(firstFile, key)
      if (res.$metadata.httpStatusCode === 200) {
        result.set(fieldName, key)
      }
    }
    return result
  }

  async updateUserProfileDb(userId: string, uploadFilesMap: Map<string, string>) {

    let updateDataObj = {}
    for (const [key, val] of uploadFilesMap) {
      updateDataObj[key] = val
    }
    const data = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: updateDataObj,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        pancard_image: true,
        aadharcard_front_image: true,
        aadharcard_back_image: true,
        driving_license_front_image: true,
        driving_license_back_image: true,
      }
    })
    if (data?.pancard_image) {
      const file = await this.s3Service.getUploadedFile(data.pancard_image)
      data.pancard_image = file ? file : null
    }
    if (data?.aadharcard_front_image) {
      const file = await this.s3Service.getUploadedFile(data.aadharcard_front_image)
      data.aadharcard_front_image = file ? file : null
    }
    if (data?.aadharcard_back_image) {
      const file = await this.s3Service.getUploadedFile(data.aadharcard_back_image)
      data.aadharcard_back_image = file ? file : null
    }
    if (data?.driving_license_front_image) {
      const file = await this.s3Service.getUploadedFile(data.driving_license_front_image)
      data.driving_license_front_image = file ? file : null
    }
    if (data?.driving_license_back_image) {
      const file = await this.s3Service.getUploadedFile(data.driving_license_back_image)
      data.driving_license_back_image = file ? file : null
    }
    return data
  }

  async uploadUpdatePaymentImage(paymentId: string, image: Express.Multer.File) {
    const paymentExist = await this.prismaService.payment.findUnique({
      where: {
        id: paymentId,
      },
      select: {
        id: true,
        image: true,
      }
    })
    if (!paymentExist) throw new NotFoundException('Payment not found.')

    if (image) {
      image.buffer = await this.compressService.compressImage(image.buffer, image.fieldname)
      image.filename = paymentExist.image
    }

    const upload: string = await this.uploadPaymentImage(image)

    return this.updatePaymentDb(paymentExist.id, upload)

  }

  async uploadPaymentImage(image: Express.Multer.File) {
    const key: string = image.filename ? image.filename : randomUUID()
    const res = await this.s3Service.uploadFile(image, key)
    if (!res) throw new InternalServerErrorException('Image upload to s3 failed.')
    return key
  }

  async updatePaymentDb(paymentId: string, upload: string) {

    const payment = await this.prismaService.payment.update({
      where: {
        id: paymentId,
      },
      data: {
        image: upload,
      },
      select: {
        id: true,
        image: true,
        amount: true,
      }
    })
    if (!payment) throw new InternalServerErrorException('Payment image update to db failed.')
    payment.image = payment.image ? `https://${this.configService.get<string>('AWS_BUCKET')}.${this.configService.get<string>('AWS_STORAGE_TYPE')}.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${payment.image}` : null
    return payment
  }


  async createEventExcelUpload(id: string, createEventExcelUploadInput: CreateEventExcelUploadInput, file: Express.Multer.File) {
    try {
      const excel = await this.prismaService.excelUpload.create({
        data: {
          createdById: id,
          name: createEventExcelUploadInput.name,
          file_filename: file.originalname,
        },
        select: {
          id: true,
          file_filename:true,
          
        }
      });
      if (!excel) throw new InternalServerErrorException('Excel metadata creation failed.')


      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const workSheet = workbook.Sheets[workbook.SheetNames[0]]
      const data = XLSX.utils.sheet_to_json(workSheet);
      console.log(data, 'data');

      const event = await this.prismaService.event.findUnique({
        where: {
          id: createEventExcelUploadInput.eventId,
        },
        select: {
          id: true,
          startDate: true,
          endDate: true,
          gapInBetweenVehicles: true,
        }
      });

      if (!event) {
        throw new Error('Event not found.');
      }

      for (const row of data){
        const lastVehicle = await this.prismaService.vehicle.findFirst({
          where: { eventId: createEventExcelUploadInput.eventId },
          orderBy: { bidTimeExpire: 'desc' }, 
        });
  
    
        let bidStartTime: Date;
        let bidTimeExpire: Date;
    
        if (!lastVehicle) {
          bidStartTime = new Date(event.startDate);
          bidTimeExpire = new Date(event.endDate);
          await this.prismaService.event.update({
                where: { id: createEventExcelUploadInput.eventId },
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
    
        await this.prismaService.vehicle.createMany({
          data: {    
            createdById:id,
            // currentBidUserId: createEventExcelUploadInput.userId ,
            eventId: createEventExcelUploadInput.eventId ,  
            bidStartTime:bidStartTime,
            bidTimeExpire:bidTimeExpire,
            registrationNumber  :row['Registration_Number']!== undefined ? row['Registration_Number'].toString() : null,          
            loanAgreementNo :row['Loan_Agreement_No']!== undefined ? row['Loan_Agreement_No'].toString() : null,       
            registeredOwnerName:row['Customer_Name']!== undefined ? row['Customer_Name'].toString() : null,    
            quoteIncreament :row['Quote_Increament']??null,       
            make            :row['Make']!== undefined ? row['Make'].toString() : null,      
            model           :row['Model']!== undefined ? row['Model'].toString() : null,      
            varient         :row['Variant']!== undefined ? row['Variant'].toString() : null,
            category        :row['Category']!== undefined ? row['Category'].toString() : null,      
            fuel            :row['Fuel']!== undefined ? row['Fuel'].toString() : null,
            type            :row['Type']!== undefined ? row['Type'].toString() : null,
            rcStatus        :row['RC_Status']!== undefined ? row['RC_Status'].toString() : null,       
            YOM             :row['YOM']??null,      
            ownership        :row['Ownership']??null,
            mileage          :row['Mileage']??null,
            kmReading        :row['Km_Reading']??null,
            insuranceStatus  :row['Insurance_Status']!== undefined ? row['Insurance_Status'].toString() : null,      
            yardLocation     :row['yard_Location']!== undefined ? row['yard_Location'].toString() : null,
            startPrice       :row['Start_Price']??null, 
            reservePrice     :row['Reserve_Price']??null,
            repoDt           :row['Repo_Dt']!== undefined ? row['Repo_Dt'].toString() : null,
            veicleLocation   :row['Veicle_Location']!== undefined ? row['Veicle_Location'].toString() : null,     
            vehicleRemarks   :row['Vehicle_Remarks']!== undefined ? row['Vehicle_Remarks'].toString() : null,      
            auctionManager   :row['Auction_Manager']!== undefined ? row['Auction_Manager'].toString() : null,      
            parkingCharges   :row['Parking_Charges']!== undefined ? row['Parking_Charges'].toString() : null,      
            insurance        :row['Insurance_Type']!== undefined ? row['Insurance_Type'].toString() : null,    
            insuranceValidTill:row['Insurance_Expiry_Date']!== undefined ? row['Insurance_Expiry_Date'].toString() : null,
            tax               :row['Tax_Type']!== undefined ? row['Tax_Type'].toString() : null,     
            taxValidityDate   :row['Tax_Validity_Date']!== undefined ? row['Tax_Validity_Date'].toString() : null,
            fitness           :row['Fitness']!== undefined ? row['Fitness'].toString() : null,   
            permit            :row['Permit']!== undefined ? row['Permit'].toString() : null,
            engineNo          :row['Engine_No']!== undefined ? row['Engine_No'].toString() : null,     
            chassisNo         :row['Chassis_No']!== undefined ? row['Chassis_No'].toString() : null,
            image             :row['Image']!== undefined ? row['Image'].toString() : null,
            inspectionLink    :row['Inspection_Link']!== undefined ? row['Inspection_Link'].toString() : null,    
            autobseContact    :row['Autobse_Contact']!== undefined ? row['Autobse_Contact'].toString() : null,    
            autobse_contact_person :row['Autobse_Contact_Person']!== undefined ? row['Autobse_Contact_Person'].toString() : null,
            vehicleCondition   :row['Vehicle_Condition']!== undefined ? row['Vehicle_Condition'].toString() : null,    
            powerSteering      :row['Power_ Steering']!== undefined ? row['Power_ Steering'].toString() : null,    
            shape              :row['Shape']!== undefined ? row['Shape'].toString() : null,    
            color              :row['Color']!== undefined ? row['Color'].toString() : null,
            state              :row['State']!== undefined ? row['State'].toString() : null,    
            city               :row['City']!== undefined ? row['City'].toString() : null,    
            area               :row['Area']!== undefined ? row['Area'].toString() : null,
            paymentTerms       :row['Payment_Terms']!== undefined ? row['Payment_Terms'].toString() : null,    
            dateOfRegistration :row['Date_of_Registration']!== undefined ? row['Date_of_Registration'].toString() : null,   
            hypothication      :row['Hypothication']!== undefined ? row['Hypothication'].toString() : null,    
            climateControl     :row['Climate_Control']!== undefined ? row['Climate_Control'].toString() : null, 
            doorCount          :row['Door_Count']??null,
            gearBox            :row['Gear_Box']!== undefined ? row['Gear_Box'].toString() : null, 
            buyerFees          :row['Buyer_Fees']!== undefined ? row['Buyer_Fees'].toString() : null,
            rtoFine            :row['RTO_Fine']!== undefined ? row['RTO_Fine'].toString() : null,
            parkingRate        :row['Parking_Rate']!== undefined ? row['Parking_Rate'].toString() : null,
            approxParkingCharges:row['Approx. Parking_ Charges']!== undefined ? row['Approx. Parking_ Charges'].toString() : null,   
            clientContactPerson :row['Client_Contact_Person']!== undefined ? row['Client_Contact_Person'].toString() : null,
            clientContactNo     :row['Client_Contact_No']!== undefined ? row['Client_Contact_No'].toString() : null,
            additionalRemarks   :row['Additional_Remarks']!== undefined ? row['Additional_Remarks'].toString() : null,   
            lotNumber           :row['Lot_No']??null
          },
        });
      }
      return excel;
    }
    catch (error) {
      throw new Error(error.message)
    }
  }

  async createVehicleListExcelUpload(file: Express.Multer.File, eventId: string) {

    const event = await this.prismaService.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        id: true,
        downloadableFile_filename: true,
      }
    })
    if (!event) throw new NotFoundException('Event not found.')

    const key: string = event?.downloadableFile_filename ? event.downloadableFile_filename : randomUUID()

    const res = await this.s3Service.uploadFile(file, key)
    if (!res) throw new InternalServerErrorException('Image upload to s3 failed.')

    return this.prismaService.event.update({
      where: {
        id: event.id,
      },
      data: {
        downloadableFile_filename: key,
      },
      select: {
        id: true,
        eventNo: true,
        downloadableFile_filename: true,
      }
    })
  }

}

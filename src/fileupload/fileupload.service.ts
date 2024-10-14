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


      const lastVehicle = await this.prismaService.vehicle.findFirst({
        where: { eventId: event.id },
        orderBy: { bidTimeExpire: 'desc' },
      });


      let bidStartTime: Date;
      let bidTimeExpire: Date;

      if (!lastVehicle) {
        bidStartTime = new Date(event.startDate);
        bidTimeExpire = new Date(event.endDate);
        await this.prismaService.event.update({
          where: { id: event.id },
          data: { endDate: bidTimeExpire, firstVehicleEndDate: bidTimeExpire },
        });
      }
      else {
        bidStartTime = new Date(event.startDate);
        const bidExpire = new Date(lastVehicle.bidTimeExpire);
        bidTimeExpire = new Date(bidExpire.getTime() + event.gapInBetweenVehicles * 60000);
      }





          //   await this.prismaService.vehicle.createMany({
          //   data: {
          //     createdById: id,
          //     // currentBidUserId:userId,
          //     eventId: event.id,
          //     bidStartTime: bidStartTime,
          //     bidTimeExpire: bidTimeExpire,
          //     registrationNumber: row['Registration_Number'],
          //     loanAgreementNo: row['Loan_Agreement_No'],
          //     registeredOwnerName: row['Customer_Name'] ?? null,
          //     quoteIncreament: row['Quote_Increament'] ?? null,
          //     make: row['Make'] ?? null,
          //     model: row['Model'] ?? null,
          //     varient: row['Variant'] ?? null,
          //     category: row['Category'] ?? null,
          //     fuel: row['Fuel'] ?? null,
          //     type: row['Type'] ?? null,
          //     rcStatus: row['RC_Status'] ?? null,
          //     YOM: row['YOM'] ?? null,
          //     ownership: row['Ownership'] ?? null,
          //     mileage: row['Mileage'] ?? null,
          //     kmReading: row['Km_Reading'] ?? null,
          //     insuranceStatus: row['Insurance_Status'] ?? null,
          //     yardLocation: row['yard_Location'] ?? null,
          //     startPrice: row['Start_Price'] ?? null,
          //     reservePrice: row['Reserve_Price'] ?? null,
          //     repoDt: row['Repo_Dt'] ?? null,
          //     veicleLocation: row['Veicle_Location'] ?? null,
          //     vehicleRemarks: row['Vehicle_Remarks'] ?? null,
          //     auctionManager: row['Auction_Manager'] ?? null,
          //     parkingCharges: row['Parking_Charges'] !== undefined ? row['Parking_Charges'].toString() : null,
          //     insurance: row['Insurance_Type'] ?? null,
          //     insuranceValidTill: row['Insurance_Expiry_Date'] !== undefined ? row['Insurance_Expiry_Date'].toString() : null,
          //     tax: row['Tax_Type'] !== undefined ? row['Tax_Type'].toString() : null,
          //     taxValidityDate: row['Tax_Validity_Date'] ?? null,
          //     fitness: row['Fitness'] ?? null,
          //     permit: row['Permit'] ?? null,
          //     engineNo: row['Engine_No'] ?? null,
          //     chassisNo: row['Chassis_No'] ?? null,
          //     image: row['Image'] ?? null,
          //     inspectionLink: row['Inspection_Link'],
          //     autobseContact: row['Autobse_Contact'] !== undefined ? row['Autobse_Contact'].toString() : null,
          //     autobse_contact_person: row['Autobse_Contact_Person'] ?? null,
          //     vehicleCondition: row['Vehicle_Condition'] ?? null,
          //     powerSteering: row['Power_ Steering'] ?? null,
          //     shape: row['Shape'] ?? null,
          //     color: row['Color'] ?? null,
          //     state: row['State'] ?? null,
          //     city: row['City'] ?? null,
          //     area: row['Area'] ?? null,
          //     paymentTerms: row['Payment_Terms'] ?? null,
          //     dateOfRegistration: row['Date_of_Registration'] ?? null,
          //     hypothication: row['Hypothication'] ?? null,
          //     climateControl: row['Climate_Control'] ?? null,
          //     doorCount: row['Door_Count'] ?? null,
          //     gearBox: row['Gear_Box'] ?? null,
          //     buyerFees: row['Buyer_Fees'] !== undefined ? row['Buyer_Fees'].toString() : null,
          //     rtoFine: row['RTO_Fine'] !== undefined ? row['RTO_Fine'].toString() : null,
          //     parkingRate: row['Parking_Rate'] !== undefined ? row['Parking_Rate'].toString() : null,
          //     approxParkingCharges: row['Approx. Parking_ Charges'] !== undefined ? row['Approx. Parking_ Charges'].toString() : null,
          //     clientContactPerson: row['Client_Contact_Person'] ?? null,
          //     clientContactNo: row['Client_Contact_No'] !== undefined ? row['Client_Contact_No'].toString() : null,
          //     additionalRemarks: row['Additional_Remarks'] ?? null,
          //     lotNumber: row['Lot_No'] ?? null
          //   },
          // });


    
      return 'empty';
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

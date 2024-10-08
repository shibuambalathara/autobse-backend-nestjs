import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { s3Service } from 'src/services/s3/s3.service';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { compressService } from 'src/services/compress/compress.service';
import { ConfigService } from '@nestjs/config';

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
}

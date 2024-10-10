import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseInterceptors, UploadedFiles, BadRequestException, InternalServerErrorException, UploadedFile, UseGuards, Req } from '@nestjs/common';
import { FileuploadService } from './fileupload.service';
import { UpdateUserProfileFileuploadDto } from './dto/update-userprofile.dto';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/role.decorator';
import { Request } from 'express';

@Controller('api/v1/fileupload')
export class FileuploadController {
  constructor(private readonly fileuploadService: FileuploadService) { }

  @Put('userprofile/:userId')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'pancard_image', maxCount: 1 },
    { name: 'aadharcard_front_image', maxCount: 1 },
    { name: 'aadharcard_back_image', maxCount: 1 },
    { name: 'driving_license_front_image', maxCount: 1 },
    { name: 'driving_license_back_image', maxCount: 1 },
  ], {
    limits: {
      fileSize: 2 * 1024 * 1014,
      files: 5,
    },
    fileFilter(req, file, callback) {
      const allowedExtensions = ['image/jpeg', 'image/png']
      if (!allowedExtensions.includes(file.mimetype)) {
        callback(new BadRequestException(`Invalid file type for ${file.fieldname}. Only JPEG and PNG files are allowed.`), false)
      }
      callback(null, true)
    },
  }))
  async updateUserProfileFiles(
    @Param('userId') userId: string,
    @UploadedFiles() files: {
      pancard_image?: [Express.Multer.File],
      aadharcard_front_image?: [Express.Multer.File],
      aadharcard_back_image?: [Express.Multer.File],
      driving_license_front_image?: [Express.Multer.File],
      driving_license_back_image?: [Express.Multer.File],
    }
  ) {
    
    if (!files) throw new BadRequestException('Files should not be empty.')
    const res = await this.fileuploadService.uploadUpdateUserProfile(userId, files)
    if (!res) throw new InternalServerErrorException('User profile files upload and updation failed.')

    return {
      success: true,
      message: 'User profile files uploaded and updated successfully.',
      res,
    }
  }

  @Put('paymentImg/:paymentId')
  @UseInterceptors(FileInterceptor('image', {
    limits: {
      fileSize: 2 * 1024 * 1014,
      files: 1,
    },
    fileFilter(req, file, callback) {
      const allowedExtensions = ['image/jpeg', 'image/png']
      if (!allowedExtensions.includes(file.mimetype)) {
        callback(new BadRequestException(`Invalid file type for ${file.fieldname}. Only JPEG and PNG files are allowed.`), false)
      }
      callback(null, true)
    },
  }))
  async uploadPaymentImage(
    @Param('paymentId') paymentId: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    console.log(image,'its image');

    if (!image) throw new BadRequestException('Image should not be empty.')
      const res = await this.fileuploadService.uploadUpdatePaymentImage(paymentId, image)
      if (!res) throw new InternalServerErrorException('Payment image upload and updation failed.')
  
      return {
        success: true,
        message: 'Payment image uploaded and updated successfully.',
        res,
      }
  }

  @Post('event_excel')
  // @UseGuards(GqlAuthGuard,RolesGuard)
  // @Roles('admin', 'staff')
  @UseInterceptors(FileInterceptor('file'))
  async createEventExcelUpload(
    @Param('eventId') eventId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request
  ) {
    // const user = req.user
    // console.log(user,'its user');
    const res = await this.fileuploadService.createEventExcelUpload('dkfj','djfkd', file, 'name')
    if (!res) throw new InternalServerErrorException('Excel upload failed.')
      return {
        success: true,
        message: 'Excel uploaded sucessfully.',
        res,
      }
  }

  @Put('vehicle_list_excel/:eventId')
  // @UseGuards(GqlAuthGuard,RolesGuard)
  // @Roles('admin', 'staff')
  @UseInterceptors(FileInterceptor('file',{
    limits: {
      fileSize: 2 * 1024 * 1014,
      files: 1,
    },
    fileFilter(req, file, callback) {
      const allowedExtensions = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ]
      if (!allowedExtensions.includes(file.mimetype)) {
        callback(new BadRequestException(`Invalid file type for ${file.fieldname}. Only excel files are allowed.`), false)
      }
      callback(null, true)
    },
  }))
  async createVehicleListExcelUpload(
    @Param('eventId') eventId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request
  ) {
    const res = await this.fileuploadService.createVehicleListExcelUpload(file, eventId)
    if (!res) throw new InternalServerErrorException('Excel upload failed.')
      return {
        success: true,
        message: 'Excel uploaded sucessfully.',
        res,
      }
  }
  
}

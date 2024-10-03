import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseInterceptors, UploadedFiles, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { FileuploadService } from './fileupload.service';
import { UpdateUserProfileFileuploadDto } from './dto/update-userprofile.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

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
}

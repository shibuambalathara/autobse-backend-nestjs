import { GetObjectCommand, PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

@Injectable()
export class s3Service {
    private readonly s3: S3
    constructor(
        private readonly configService: ConfigService,
    ) {
        this.s3 = new S3({
            region: this.configService.get<string>('AWS_REGION'),
            credentials: {
                accessKeyId: this.configService.get<string>('AWS_IAM_ACCESS_KEY'),
                secretAccessKey: this.configService.get<string>('AWS_IAM_SECRET_ACCESS_KEY'),
            },

        })
    }

    async uploadFile(file: Express.Multer.File, key: string) {
        const params = {
            Bucket: process.env.AWS_BUCKET,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype
        }
        const command = new PutObjectCommand(params)
        return this.s3.send(command)
    }

    async getUploadedFile(key: string) {
        const params = {
            Bucket: this.configService.get<string>('AWS_BUCKET'),
            Key: key,
        }
        try {
            const command = new GetObjectCommand(params)
            const url = await getSignedUrl(this.s3, command, { expiresIn: 5 })
            return url

        } catch (error) {
            console.error('Error retrieving file from s3.')
        }
    }

    async getUploadedExcelFile(key: string) {
        const params = {
            Bucket: this.configService.get<string>('AWS_BUCKET'),
            Key: key,
        }
        try {
            const command = new GetObjectCommand(params)
            const url = await getSignedUrl(this.s3, command, { expiresIn: 24*60*60 })
            return url

        } catch (error) {
            console.error('Error retrieving file from s3.')
        }
    }
}
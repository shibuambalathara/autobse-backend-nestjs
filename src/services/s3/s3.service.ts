import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class s3Service{
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
}
import { BadRequestException, Injectable } from "@nestjs/common";
import * as sharp from "sharp";

@Injectable()
export class compressService {
    constructor() { }


    async compressImage(buffer: Buffer, fieldName: string): Promise<Buffer> {
        let quality: number = 90
        let compressedImage: Buffer = buffer
        let imageSize: number = buffer.length

        while (imageSize > 1 * 1024 * 1024 && quality > 10) {
            compressedImage = await sharp(buffer)
                .jpeg({ quality })
                .toBuffer()

            imageSize = compressedImage.length
            quality -= 10
        }
        if (imageSize > 1 * 1024 * 1024) {
            throw new BadRequestException(`Unable to compress ${fieldName} to less than 1 MB`)
        }
        return compressedImage
    }

}
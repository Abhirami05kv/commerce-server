import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFiles,
    Body,
} from '@nestjs/common';
import { OfferService } from './offer.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('api/offer')
export class OfferController {
    constructor(private readonly offerService: OfferService) { }

    @Post('send')
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'image', maxCount: 1 },
                { name: 'document', maxCount: 1 },
            ],
            {
                storage: diskStorage({
                    destination: './uploads/offers',
                    filename: (req, file, cb) => {
                        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
                        cb(null, `${file.fieldname}-${unique}${extname(file.originalname)}`);
                    },
                }),
                limits: { fileSize: 10 * 1024 * 1024 },
            },
        ),
    )
    async createOffer(
        @Body() dto: CreateOfferDto,
        @UploadedFiles()
        files: { image?: Express.Multer.File[]; document?: Express.Multer.File[] },
    ) {
       
        const imagePath = files?.image?.[0]
            ? `/uploads/offers/${files.image[0].filename}`
            : undefined;

        const docPath = files?.document?.[0]
            ? `/uploads/offers/${files.document[0].filename}`
            : undefined;

        console.log('Uploaded offer files:', { imagePath, docPath });

        return this.offerService.createOffer(dto, imagePath, docPath);
    }
}


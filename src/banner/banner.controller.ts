import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner-dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { BannerService } from './banner.service';
import { UpdateBannerDto } from './dto/update-banner-dto';
import { Banner } from './entity/banner-entity';
import { DeleteDto } from './dto/delete.dto';

@Controller('api/banner')
export class BannerController {

    constructor(private readonly bannerService: BannerService) { }


    @Post('create')
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'bannerImage', maxCount: 1 },
                { name: 'productImage', maxCount: 1 }
            ],
            {
                storage: diskStorage({
                    destination: './uploads/banners',
                    filename: (req, file, cb) => {
                        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
                        const ext = extname(file.originalname);
                        cb(null, `${unique}${ext}`);
                    },
                }),
                limits: { fileSize: 10 * 1024 * 1024 },
            }
        )
    )
    async create(
        @Body() createBannerDto: CreateBannerDto,
        @UploadedFiles()
        files: {
            bannerImage?: Express.Multer.File[];
            productImage?: Express.Multer.File[];
        },
    ) {
        if (!files.bannerImage?.[0]) {
            throw new BadRequestException('Banner image is required');
        }
        if (!files.productImage?.[0]) {
            throw new BadRequestException('Product image is required');
        }

        const bannerImagePath = `/uploads/banners/${files.bannerImage[0].filename}`;
        const productImagePath = `/uploads/banners/${files.productImage[0].filename}`;

        return await this.bannerService.createBanner(
            createBannerDto,
            bannerImagePath,
            productImagePath
        );
    }

    @Get(':id')
    async getBannerById(@Param('id', ParseIntPipe) id: number) {
        return await this.bannerService.getBannerById(id);
    }


    @Put(':id')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'bannerImage', maxCount: 1 },
            { name: 'productImage', maxCount: 1 },
        ], {
            storage: diskStorage({
                destination: './uploads/banners',
                filename: (req, file, cb) => {
                    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    cb(null, `${unique}${ext}`);
                },
            }),
            limits: { fileSize: 10 * 1024 * 1024 },
        }),
    )
    async updateBanner(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateBannerDto: UpdateBannerDto,
        @UploadedFiles()
        files: {
            bannerImage?: Express.Multer.File[];
            productImage?: Express.Multer.File[];
        },
    ) {
        if (files?.bannerImage?.[0]) {
            updateBannerDto.bannerImage = `/uploads/banners/${files.bannerImage[0].filename}`;
        }
        if (files?.productImage?.[0]) {
            updateBannerDto.productImage = `/uploads/banners/${files.productImage[0].filename}`;
        }

        return await this.bannerService.updateBanner(id, updateBannerDto);
    }



    @Get()
    async getAllBanners(): Promise<Banner[]> {
        return await this.bannerService.getAllBanners();
    }


    @Delete('delete')
    async bulkDelete(@Body() bulkDeleteDto: DeleteDto) {
        return this.bannerService.Delete(bulkDeleteDto.ids);
    }
}

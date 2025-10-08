
import {
    Controller,
    Post,
    Get,
    Param,
    Delete,
    UploadedFile,
    UseInterceptors,
    Body,
    BadRequestException,
    Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateHomeVideoDto } from './dto/create-home-video.dto';
import { plainToInstance } from 'class-transformer';
import { HomeVideoService } from './home.service';
import { DeleteHomeVideoDto } from './dto/delete-home-video.dto';
import { UpdateHomeVideoDto } from './dto/update-home-video.dto';
import { CreateHighlightProductDto } from './dto/create-highlight-product.dto';
import { UpdateHighlightProductDto } from './dto/UpdateHighlightProductDto';
import { DeleteHighlightProductDto } from './dto/delete-highlight-product.dto';

@Controller('api/home')
export class HomeVideoController {
    constructor(private readonly homeVideoService: HomeVideoService,
   
    ) { }

    @Post('upload')
    @UseInterceptors(
        FileInterceptor('video', {
            storage: diskStorage({
                destination: './uploads/videos',
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, uniqueSuffix + extname(file.originalname));
                },
            }),
            limits: { fileSize: 50 * 1024 * 1024 },
            fileFilter: (req, file, cb) => {
               
                const allowedExt = ['.mp4', '.mov', '.avi', '.mkv'];
                const fileExt = extname(file.originalname).toLowerCase();
                if (!allowedExt.includes(fileExt)) {
                    return cb(new BadRequestException('Only video files are allowed!'), false);
                }
                cb(null, true);
            },
        }),
    )
    async uploadVideo(
        @Body() dto: CreateHomeVideoDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) {
            throw new BadRequestException('Video file is required');
        }
        const videoUrl = `/uploads/videos/${file.filename}`;
        return this.homeVideoService.createVideo(dto, videoUrl);
    }

    @Get('videos-all')
    async findAllVideos() {
        return this.homeVideoService.findAll();
    }

    @Get('videos/:id')
    async findOneVideo(@Param('id') id: number) {
        return this.homeVideoService.findOne(Number(id));
    }

    @Delete('delete')
    async removeMultiple(@Body() dto: DeleteHomeVideoDto) {
        return this.homeVideoService.removeMultiple(dto.ids);
    }

    @Patch('update-videos/:id')
    @UseInterceptors(
        FileInterceptor('video', {
            storage: diskStorage({
                destination: './uploads/videos',
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, uniqueSuffix + extname(file.originalname));
                },
            }),
            limits: { fileSize: 50 * 1024 * 1024 },
            fileFilter: (req, file, cb) => {
                const allowedExt = ['.mp4', '.mov', '.avi', '.mkv'];
                if (!allowedExt.includes(extname(file.originalname).toLowerCase())) {
                    return cb(new BadRequestException('Only video files are allowed!'), false);
                }
                cb(null, true);
            },
        }),
    )
    async updateVideo(
        @Param('id') id: number,
        @Body() dto: UpdateHomeVideoDto,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        const videoUrl = file ? `/uploads/videos/${file.filename}` : undefined;
        return this.homeVideoService.updateVideo(Number(id), dto, videoUrl);
    }


    @Post('create')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './uploads/highlight-products',
                filename: (req, file, cb) => {
                    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, unique + extname(file.originalname));
                },
            }),
            limits: { fileSize: 10 * 1024 * 1024 },
        }),
    )
    async create(@Body() body: CreateHighlightProductDto, @UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException('Image file is required');
        const imageUrl = `/uploads/highlight-products/${file.filename}`;
        return this.homeVideoService.create(body, imageUrl);
    }

    @Patch('update-products/:id')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './uploads/highlight-products',
                filename: (req, file, cb) => {
                    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, unique + extname(file.originalname));
                },
            }),
            limits: { fileSize: 10 * 1024 * 1024 },
        }),
    )
    async update(@Param('id') id: number, @Body() body: UpdateHighlightProductDto, @UploadedFile() file?: Express.Multer.File) {
        const imageUrl = file ? `/uploads/highlight-products/${file.filename}` : undefined;
        return this.homeVideoService.update(Number(id), body, imageUrl);
    }

    @Get('products-all')
    async getAllHighlightProducts() {
        return this.homeVideoService.getAll();
    }

    @Get('products/:id')
    async getHighlightProductById(@Param('id') id: number) {
        return this.homeVideoService.getById(Number(id));
    }

    @Delete('products/delete')
    async deleteMultiple(@Body() dto: DeleteHighlightProductDto) {
        return this.homeVideoService.deleteMultiple(dto.ids);
    }
}


import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product-dto';
import { UpdateProductDto } from './dto/update-product-dto';
import { Category } from 'src/category/entity/category.entity';
import { plainToInstance } from 'class-transformer';


@Controller('api/product')
export class ProductController {

    constructor(private readonly productService: ProductService) { }



    // @Post('create')
    // @UseInterceptors(
    //     FileInterceptor('imageUrls', {
    //         storage: diskStorage({
    //             destination: './uploads/products',
    //             filename: (req, file, cb) => {
    //                 const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    //                 const ext = extname(file.originalname);
    //                 cb(null, `${unique}${ext}`);
    //             },
    //         }),
    //         limits: { fileSize: 10 * 1024 * 1024 },
    //     }),
    // )
    // async create(
    //     @UploadedFile() file: Express.Multer.File,
    //     @Body() body: any,
    // ) {

    //     if (body.variants) {
    //         try {
    //             body.variants = JSON.parse(body.variants);
    //         } catch (err) {
    //             throw new BadRequestException('Invalid JSON format for variants');
    //         }
    //     }

    //     const dto: CreateProductDto = plainToInstance(CreateProductDto, body);

    //     const imagePath = file ? `/uploads/products/${file.filename}` : '';
    //     return await this.productService.createProduct(dto, imagePath);
    // }

    @Post('create')
    @UseInterceptors(
        FilesInterceptor('imageUrls', 10, {
            storage: diskStorage({
                destination: './uploads/products',
                filename: (req, file, cb) => {
                    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    cb(null, `${unique}${ext}`);
                },
            }),
            limits: { fileSize: 10 * 1024 * 1024 },
        }),
    )
    async create(
        @UploadedFiles() files: Express.Multer.File[],
        @Body() body: any,
    ) {
        if (body.variants) {
            try {
                body.variants = JSON.parse(body.variants);
            } catch (err) {
                throw new BadRequestException('Invalid JSON format for variants');
            }
        }

        const dto: CreateProductDto = plainToInstance(CreateProductDto, body);

        const imagePaths = files?.length
            ? files.map((file) => `/uploads/products/${file.filename}`)
            : [];

        return await this.productService.createProduct(dto, imagePaths);
    }





    // @Get()
    // async findAll(
    //     @Query('page') page: string = '1',
    //     @Query('limit') limit: string = '10',
    //     @Query('paginate') paginate: string = 'true',
    //     @Query('categoryId') categoryId?: string,
    //     @Query('category') category?: Category | Category[],
    //     @Query('search') search?: string,
    //     @Query('offer') offer?: string,
    // ): Promise<{
    //     statusCode: number;
    //     message: string;
    //     data: {
    //         id: number;
    //         name: string;
    //         imageUrls: string;
    //         price: number;
    //         stock: number;
    //         status?: string;
    //         description?: string;
    //         count?: number;
    //         category: {
    //             id: number;
    //             name: string;
    //             status?: string;
    //         };
    //         offer?: number | null;
    //         offerPrice?: number | null;
    //     }[];
    //     total?: number;
    // }> {
    //     const pageNumber = parseInt(page, 10);
    //     const limitNumber = parseInt(limit, 10);
    //     const paginateBoolean = paginate === 'true';
    //     const categoryIdNumber = categoryId ? parseInt(categoryId, 10) : null;
    //     const offerBoolean = offer === 'true';

    //     const categoryArray = category
    //         ? Array.isArray(category)
    //             ? category
    //             : [category]
    //         : undefined;

    //     const products = await this.productService.findAll({
    //         page: pageNumber,
    //         limit: limitNumber,
    //         paginate: paginateBoolean,
    //         categoryId: categoryIdNumber,
    //         category: categoryArray,
    //         search,
    //         offer: offerBoolean,
    //     });

    //     return {
    //         statusCode: 200,
    //         message: 'Products fetched successfully',
    //         data: products.data.map((product) => ({
    //             id: product.id,
    //             name: product.name,
    //             imageUrls: product.imageUrls,
    //             price: product.price,
    //             stock: product.stock,
    //             description: product.description,
    //             status: product.status,
    //             count: product.count,
    //             offer: product.offer ?? null,
    //             offerPrice: product.offer
    //                 ? parseFloat(
    //                     (product.price - (product.price * product.offer) / 100).toFixed(2)
    //                 )
    //                 : null,
    //             category: {
    //                 id: product.category?.id,
    //                 name: product.category?.name,
    //                 status: product.category?.status,
    //             },
    //         })),
    //         ...(paginateBoolean && {
    //             total: products.total,
    //             page: pageNumber,
    //             limit: limitNumber,
    //         }),
    //     };
    // }

    @Get()
    async findAll(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
        @Query('paginate') paginate: string = 'true',
        @Query('categoryId') categoryId?: string,
        @Query('category') category?: Category | Category[],
        @Query('search') search?: string,
        @Query('offer') offer?: string,
        @Query('bestSeller') bestSeller?: string,
    ): Promise<{
        statusCode: number;
        message: string;
        data: {
            id: number;
            name: string;
            imageUrls: string;
            price: number;
            stock: number;
            size: number;
            status?: string;
            description?: string;
            count?: number;
            bestseller: boolean;
            category: {
                id: number;
                name: string;
                status?: string;
            };
            offer?: number | null;
            offerPrice?: number | null;
        }[];
        total?: number;
    }> {
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const paginateBoolean = paginate === 'true';
        const categoryIdNumber = categoryId ? parseInt(categoryId, 10) : null;
        const offerBoolean = offer === 'true';
        const bestSellerBoolean = bestSeller === 'true';

        const categoryArray = category
            ? Array.isArray(category)
                ? category
                : [category]
            : undefined;

        const products = await this.productService.findAll({
            page: pageNumber,
            limit: limitNumber,
            paginate: paginateBoolean,
            categoryId: categoryIdNumber,
            category: categoryArray,
            search,
            offer: offerBoolean,
            bestSeller: bestSellerBoolean,
        });

        return {
            statusCode: 200,
            message: 'Products fetched successfully',
            data: products.data.map((product) => ({
                id: product.id,
                name: product.name,
                imageUrls: product.imageUrls,
                price: product.price,
                stock: product.stock,
                size: product.size,
                description: product.description,
                status: product.status,
                count: product.count,
                offer: product.offer ?? null,
                bestseller: product.bestseller,
                offerPrice: product.offer
                    ? parseFloat(
                        (product.price - (product.price * product.offer) / 100).toFixed(2)
                    )
                    : null,
                category: {
                    id: product.category?.id,
                    name: product.category?.name,
                    status: product.category?.status,
                },
                variants: product.variants?.map((variant) => ({
                    id: variant.id,
                    name: variant.name,
                    price: variant.price,
                    stock: variant.stock,
                    size: variant.size,
                    status: variant.status,
                })) ?? [],

            })),
            ...(paginateBoolean && {
                total: products.total,
                page: pageNumber,
                limit: limitNumber,
            }),
        };
    }




    @Get(':id')
    async findOne(@Param('id') id: string) {
        const response = await this.productService.findOne(+id);

        if (response.statusCode !== 200 || !response.data) {
            throw new NotFoundException(response.message);
        }

        const baseUrl = '/uploads/products/';
        const product = response.data;

        return {
            statusCode: response.statusCode,
            message: response.message,
            data: {
                ...product,


            },
        };
    }




    // @Put('update/:id')
    // @UseInterceptors(
    //     FileInterceptor('imageUrls', {
    //         storage: diskStorage({
    //             destination: './uploads/products',
    //             filename: (req, file, cb) => {
    //                 const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    //                 cb(null, uniqueSuffix + extname(file.originalname));
    //             },
    //         }),
    //     }),
    // )
    // async update(
    //     @Param('id') id: number,
    //     @UploadedFile() file: Express.Multer.File,
    //     @Body() body: any,
    // ) {
    //     if (body.variants) {
    //         try {
    //             body.variants = JSON.parse(body.variants);
    //         } catch (err) {
    //             throw new BadRequestException('Invalid JSON format for variants');
    //         }
    //     }

    //     const dto: UpdateProductDto = plainToInstance(UpdateProductDto, body);


    //     console.log('File from multer:', file);
    //     console.log('Body:', body);

    //     const imagePath = file
    //         ? `/uploads/products/${file.filename}`
    //         : body.imageUrls ?? null;

    //     return this.productService.updateProduct(id, dto, imagePath);
    // }

    @Put('update/:id')
    @UseInterceptors(
        FilesInterceptor('imageUrls', 10, {
            storage: diskStorage({
                destination: './uploads/products',
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, uniqueSuffix + extname(file.originalname));
                },
            }),
        }),
    )
    async update(
        @Param('id') id: number,
        @UploadedFiles() files: Express.Multer.File[],
        @Body() body: any,
    ) {
        if (body.variants) {
            try {
                body.variants = JSON.parse(body.variants);
            } catch (err) {
                throw new BadRequestException('Invalid JSON format for variants');
            }
        }

        const dto: UpdateProductDto = plainToInstance(UpdateProductDto, body);


        const uploadedImagePaths = files?.length
            ? files.map((file) => `/uploads/products/${file.filename}`)
            : [];


        const bodyImages = body.imageUrls
            ? Array.isArray(body.imageUrls)
                ? body.imageUrls
                : [body.imageUrls]
            : [];


        const finalImages = [...bodyImages, ...uploadedImagePaths];

        return this.productService.updateProduct(id, dto, finalImages);
    }








    @Delete()
    async deleteMany(@Body('ids') ids: number[]) {
        return this.productService.delete(ids);
    }

}

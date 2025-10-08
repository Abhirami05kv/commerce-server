import { BadRequestException, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, Like, MoreThan, Repository } from 'typeorm';
import { Product } from './entity/product.entity';
import { Category } from 'src/category/entity/category.entity';
import { CreateProductDto } from './dto/create-product-dto';
import { UpdateProductDto } from './dto/update-product-dto';
import { OrderItem } from 'src/order/entity/order-item.entity';
import { Size } from 'src/cart/enum/size.enum';





@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,

        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,

        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,
    ) { }


    // async createProduct(
    //     createProductDto: CreateProductDto,
    //     imagePath: string,
    // ): Promise<{ statusCode: number; message: string; data?: any }> {

    //     const { name, description, price, categoryId, offer, variants } = createProductDto;

    //     const priceNum = parseFloat(Number(price).toFixed(2));
    //     const categoryIdNum = Number(categoryId);
    //     const offerNum = offer ? parseFloat(Number(offer).toFixed(2)) : null;

    //     if (!name || typeof name !== 'string' || name.trim() === '') {
    //         throw new BadRequestException('Product name is required and must be a non-empty string.');
    //     }

    //     if (isNaN(priceNum) || priceNum <= 0) {
    //         throw new BadRequestException('Price must be a positive number.');
    //     }

    //     if (!categoryId || isNaN(categoryIdNum)) {
    //         throw new BadRequestException('Category ID is required and must be a number.');
    //     }

    //     const category = await this.categoryRepository.findOne({ where: { id: categoryIdNum } });
    //     if (!category) {
    //         return {
    //             statusCode: 404,
    //             message: `Category with ID ${categoryId} not found`,
    //         };
    //     }

    //     const existingProduct = await this.productRepository.findOne({
    //         where: { name: name.trim(), categoryId: category.id },
    //     });

    //     if (existingProduct) {
    //         return {
    //             statusCode: 409,
    //             message: `Product with name "${name.trim()}" already exists in the "${category.name}" category`,
    //         };
    //     }


    //     let offerPrice: number | null = null;
    //     if (offerNum && offerNum > 0 && offerNum < 100) {
    //         offerPrice = parseFloat((priceNum - (priceNum * offerNum / 100)).toFixed(2));
    //     }

    //     const product = this.productRepository.create({
    //         name: name.trim(),
    //         price: priceNum,
    //         offer: offerNum,
    //         offerPrice: offerPrice,
    //         imageUrls: imagePath,
    //         category,
    //         description,
    //         variants: variants.map(v => ({
    //             size: v.size,
    //             stock: v.stock,
    //         })),
    //     });

    //     const savedProduct = await this.productRepository.save(product);

    //     return {
    //         statusCode: 201,
    //         message: 'Product created successfully!',
    //         data: {
    //             ...savedProduct,
    //             offer: offerNum ? `${offerNum}%` : null,
    //         },
    //     };
    // }









    // async findAll({
    //     page = 1,
    //     limit = 10,
    //     paginate = true,
    //     categoryId = null,
    //     category,
    //     search,
    //     offer,
    // }: {
    //     page?: number;
    //     limit?: number;
    //     paginate?: boolean;
    //     categoryId?: number | null;
    //     category?: Category[];
    //     search?: string;
    //     offer?: boolean;
    // } = {}): Promise<{
    //     statusCode: number;
    //     message: string;
    //     data: Product[];
    //     total?: number;
    //     totalPages?: number;
    //     page?: number;
    //     limit?: number;
    // }> {
    //     const findOptions: FindManyOptions<Product> = {
    //         relations: ['category'],
    //         select: ['id', 'name', 'price', 'imageUrls', 'categoryId', 'stock', 'description', 'status', 'count', 'createdAt',],
    //         order: { createdAt: 'DESC' },
    //     };

    //     if (paginate) {
    //         findOptions.skip = (page - 1) * limit;
    //         findOptions.take = limit;
    //     }

    //     const where: any = {};

    //     if (categoryId !== null && categoryId !== undefined) {
    //         where.category = { id: categoryId };
    //     }

    //     if (category && category.length > 0) {
    //         where.category = {
    //             ...(where.category || {}),
    //             name: Array.isArray(category) ? In(category) : category,
    //         };
    //     }

    //     if (search) {
    //         where.name = Like(`%${search}%`);
    //     }


    //     if (offer === true) {
    //         where.offer = MoreThan(0);
    //     }

    //     findOptions.where = where;

    //     const [products, total] = await this.productRepository.findAndCount(findOptions);

    //     // return {
    //     //     statusCode: 200,
    //     //     message: 'Products fetched successfully',
    //     //     data: products,
    //     //     ...(paginate && {

    //     //         total,
    //     //         page,
    //     //         limit,
    //     //         totalPages: Math.ceil(total / limit),
    //     //     }),
    //     // };

    //     return {
    //         statusCode: 200,
    //         message: 'Products fetched successfully',
    //         data: products.map(p => ({
    //             ...p,
    //             count: p.count ?? 0,   // 👈 ensures count always appears
    //         })),
    //         ...(paginate && {
    //             total,
    //             page,
    //             limit,
    //             totalPages: Math.ceil(total / limit),
    //         }),
    //     };





    // }


    async createProduct(
        createProductDto: CreateProductDto,
        imagePaths: string[],
    ): Promise<{ statusCode: number; message: string; data?: any }> {
        const { name, description, categoryId, offer, variants, bestseller } = createProductDto;

        const categoryIdNum = Number(categoryId);
        const offerNum = offer ? parseFloat(Number(offer).toFixed(2)) : null;

        if (!name || typeof name !== 'string' || name.trim() === '') {
            throw new BadRequestException('Product name is required and must be a non-empty string.');
        }

        if (!categoryId || isNaN(categoryIdNum)) {
            throw new BadRequestException('Category ID is required and must be a number.');
        }

        const category = await this.categoryRepository.findOne({ where: { id: categoryIdNum } });
        if (!category) {
            return {
                statusCode: 404,
                message: `Category with ID ${categoryId} not found`,
            };
        }

        const existingProduct = await this.productRepository.findOne({
            where: { name: name.trim(), categoryId: category.id },
        });

        if (existingProduct) {
            return {
                statusCode: 409,
                message: `Product with name "${name.trim()}" already exists in the "${category.name}" category`,
            };
        }


        const variantEntities = variants.map((v) => {
            const priceNum = parseFloat(Number(v.price).toFixed(2));
            if (isNaN(priceNum) || priceNum <= 0) {
                throw new BadRequestException('Variant price must be a positive number.');
            }

            let offerPrice: number | null = null;
            if (offerNum && offerNum > 0 && offerNum < 100) {
                offerPrice = parseFloat((priceNum - (priceNum * offerNum) / 100).toFixed(2));
            }

            return {
                size: v.size,
                stock: v.stock,
                price: priceNum,

            };
        });

        const product = this.productRepository.create({
            name: name.trim(),
            offer: offerNum,
            offerPrice: null,
            imageUrls: imagePaths,
            category,
            description,
            bestseller: bestseller ?? false,
            variants: variantEntities,
        });

        const savedProduct = await this.productRepository.save(product);

        return {
            statusCode: 201,
            message: 'Product created successfully!',
            data: {
                ...savedProduct,
                offer: offerNum ? `${offerNum}%` : null,
            },
        };
    }



    async findAll({
        page = 1,
        limit = 10,
        paginate = true,
        categoryId = null,
        category,
        search,
        offer,
        bestSeller = false,
    }: {
        page?: number;
        limit?: number;
        paginate?: boolean;
        categoryId?: number | null;
        category?: Category[];
        search?: string;
        offer?: boolean;
        bestSeller?: boolean;
    } = {}): Promise<{
        statusCode: number;
        message: string;
        data: any[];
        total?: number;
        totalPages?: number;
        page?: number;
        limit?: number;
    }> {
        const findOptions: FindManyOptions<Product> = {
            relations: ['category', 'variants'],
            select: [
                'id',
                'name',
                // 'price',
                'imageUrls',
                'categoryId',
                'stock',
                'description',
                'status',
                'count',
                'createdAt',
                'offer',
                'offerPrice',
                'size',
                'bestseller'
            ],
            order: { createdAt: 'DESC' },
        };






        if (paginate) {
            findOptions.skip = (page - 1) * limit;
            findOptions.take = limit;
        }

        const where: any = {};

        if (categoryId !== null && categoryId !== undefined) {
            where.category = { id: categoryId };
        }

        if (category && category.length > 0) {
            where.category = {
                ...(where.category || {}),
                name: Array.isArray(category) ? In(category) : category,
            };
        }

        if (search) {
            where.name = Like(`%${search}%`);
        }

        if (offer === true) {
            where.offer = MoreThan(0);
        }


        if (bestSeller === true) {
            // where.count = MoreThan(3);
            where.bestseller = true;
        }

        findOptions.where = where;

        const [products, total] = await this.productRepository.findAndCount(findOptions);

        return {
            statusCode: 200,
            message: 'Products fetched successfully',
            data: products.map((p) => ({
                ...p,
                count: p.count ?? 0,
                offer: p.offer ? `${p.offer}%` : null,
            })),
            ...(paginate && {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }),
        };

    }


    async findOne(
        id: number,
    ): Promise<{ statusCode: number; message: string; data?: any }> {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['category', 'variants'],
            select: [
                'id',
                'name',
                // 'price',
                'imageUrls',
                'categoryId',
                'stock',
                'description',
                'status',
                'count',
                'offer',
                'offerPrice',
                'size',
                'bestseller'
            ],
        });

        if (!product) {
            return {
                statusCode: 404,
                message: `Product with ID ${id} not found`,
            };
        }

        return {
            statusCode: 200,
            message: 'Product fetched successfully',
            data: {
                ...product,
                count: product.count ?? 0,
                offer: product.offer ? `${product.offer}%` : null,
            },
        };
    }







    // async updateProduct(
    //     id: number,
    //     updateProductDto: UpdateProductDto,
    //     imagePath?: string,
    // ): Promise<{ statusCode: number; message: string; data?: any }> {
    //     const response = await this.findOne(id);
    //     if (response.statusCode !== 200) {
    //         return { statusCode: response.statusCode, message: response.message };
    //     }

    //     const product = response.data!;

    //     if (!updateProductDto || Object.keys(updateProductDto).length === 0) {
    //         throw new BadRequestException('Fill at least one field to update');
    //     }


    //     Object.assign(product, updateProductDto);


    //     if (imagePath) {
    //         product.imageUrls = imagePath;
    //     }

    //     if (updateProductDto.price !== undefined) {
    //         updateProductDto.price = parseFloat(Number(updateProductDto.price).toFixed(2));
    //         if (isNaN(updateProductDto.price) || updateProductDto.price <= 0) {
    //             throw new BadRequestException('Price must be a positive number.');
    //         }
    //     }

    //     if (updateProductDto.categoryId) {
    //         const category = await this.categoryRepository.findOne({
    //             where: { id: updateProductDto.categoryId },
    //         });
    //         if (!category) {
    //             return { statusCode: 404, message: 'Category not found' };
    //         }
    //         product.category = category;
    //     }

    //     const finalPrice = updateProductDto.price ?? product.price;
    //     const finalOffer = updateProductDto.offer ?? product.offer;

    //     let offerPrice: number | null = null;
    //     if (finalOffer && finalOffer > 0 && finalOffer < 100) {
    //         offerPrice = parseFloat(
    //             (finalPrice - (finalPrice * finalOffer) / 100).toFixed(2),
    //         );
    //         if (offerPrice < 0) {
    //             throw new BadRequestException('Offer price cannot be negative.');
    //         }
    //     }
    //     product.offerPrice = offerPrice;

    //     product.updatedAt = new Date();

    //     if (updateProductDto.variants && updateProductDto.variants.length > 0) {
    //         for (const variantDto of updateProductDto.variants) {
    //             const variant = product.variants?.find((v) => v.id === variantDto['id']);
    //             if (variant) {
    //                 Object.assign(variant, variantDto);
    //             }
    //         }
    //     }

    //     const updatedProduct = await this.productRepository.save(product);

    //     return {
    //         statusCode: 200,
    //         message: 'Product updated successfully',
    //         data: {
    //             ...updatedProduct,
    //             offer: updatedProduct.offer !== null ? `${updatedProduct.offer}%` : null,
    //             offerPrice: updatedProduct.offerPrice,
    //             variants: updatedProduct.variants ?? [],
    //         },
    //     };
    // }
    async updateProduct(
        id: number,
        updateProductDto: UpdateProductDto,
        imagePaths?: string[],
    ): Promise<{ statusCode: number; message: string; data?: any }> {
        const response = await this.findOne(id);
        if (response.statusCode !== 200) {
            return { statusCode: response.statusCode, message: response.message };
        }

        const product = response.data!;

        if (!updateProductDto || Object.keys(updateProductDto).length === 0) {
            throw new BadRequestException('Fill at least one field to update');
        }

        Object.assign(product, updateProductDto);


        if (imagePaths && imagePaths.length > 0) {
            product.imageUrls = imagePaths;
        }

        if (updateProductDto.price !== undefined) {
            updateProductDto.price = parseFloat(Number(updateProductDto.price).toFixed(2));
            if (isNaN(updateProductDto.price) || updateProductDto.price <= 0) {
                throw new BadRequestException('Price must be a positive number.');
            }
        }

        if (updateProductDto.categoryId) {
            const category = await this.categoryRepository.findOne({
                where: { id: updateProductDto.categoryId },
            });
            if (!category) {
                return { statusCode: 404, message: 'Category not found' };
            }
            product.category = category;
        }

        const finalPrice = updateProductDto.price ?? product.price;
        const finalOffer = updateProductDto.offer ?? product.offer;

        let offerPrice: number | null = null;
        if (finalOffer && finalOffer > 0 && finalOffer < 100) {
            offerPrice = parseFloat(
                (finalPrice - (finalPrice * finalOffer) / 100).toFixed(2),
            );
            if (offerPrice < 0) {
                throw new BadRequestException('Offer price cannot be negative.');
            }
        }
        product.offerPrice = offerPrice;

        product.updatedAt = new Date();

        if (updateProductDto.bestseller !== undefined) {
            product.bestseller = updateProductDto.bestseller;
        }

        if (updateProductDto.variants && updateProductDto.variants.length > 0) {
            for (const variantDto of updateProductDto.variants) {
                const variant = product.variants?.find((v) => v.id === variantDto['id']);
                if (variant) {
                    Object.assign(variant, variantDto);
                }
            }
        }

        const updatedProduct = await this.productRepository.save(product);

        return {
            statusCode: 200,
            message: 'Product updated successfully',
            data: {
                ...updatedProduct,
                offer: updatedProduct.offer !== null ? `${updatedProduct.offer}%` : null,
                offerPrice: updatedProduct.offerPrice,
                variants: updatedProduct.variants ?? [],
            },
        };
    }










    async delete(ids: number[]) {
        const result = await this.productRepository.delete(ids);
        if (result.affected === 0) {
            throw new Error('No Product were found to delete');
        }
        return { message: `${result.affected} Products deleted successfully` };
    }
}

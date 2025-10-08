
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './enity/cart.entity';
import { CartItem } from './enity/cart.item.entity';
import { Product } from 'src/product/entity/product.entity';
import { User } from 'src/auth/entity/auth.entity';
import { AddToCartDto } from './dto/add-to-cart-dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Category } from 'src/category/entity/category.entity';
import { Size } from './enum/size.enum';
import { ProductVariant } from 'src/product/entity/product-variant.entity';



@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private cartRepo: Repository<Cart>,
        @InjectRepository(CartItem)
        private cartItemRepo: Repository<CartItem>,
        @InjectRepository(Product)
        private productRepo: Repository<Product>,
        @InjectRepository(ProductVariant)
        private variantRepo: Repository<ProductVariant>,
    ) { }








    // async addToCart(
    //     user: User,
    //     dto: AddToCartDto
    // ): Promise<{ statusCode: number; message: string; data: any }> {
    //     let cart = await this.cartRepo.findOne({
    //         where: { user: { id: user.id } },
    //         relations: ['items', 'items.product'],
    //     });

    //     if (!cart) {
    //         cart = this.cartRepo.create({ user, items: [], Price: 0, totalProductPrice: 0 });
    //         await this.cartRepo.save(cart);
    //     }

    //     const product = await this.productRepo.findOne({
    //         where: { id: dto.productId },
    //         relations: ['category'],
    //     });

    //     if (!product) {
    //         throw new NotFoundException(`Product ID ${dto.productId} not found`);
    //     }

    //     const quantity = dto.quantity ?? 1;
    //     const size = dto.size;

    //     if (quantity <= 0) {
    //         throw new BadRequestException('Quantity must be a positive number');
    //     }

    //     if (!size) {
    //         throw new BadRequestException('Size must be provided');
    //     } else {
    //         if (!Object.values(Size).includes(size)) {
    //             throw new BadRequestException(`Invalid size: ${size}`);
    //         }
    //     }


    //     const effectivePrice = product.offerPrice && product.offerPrice > 0
    //         ? Number(product.offerPrice)
    //         : Number(product.price);

    //     const existingItem = cart.items.find(
    //         (item) => item.product.id === dto.productId && item.size === size
    //     );

    //     if (existingItem) {
    //         existingItem.quantity += quantity;
    //         existingItem.price = effectivePrice;
    //         await this.cartItemRepo.save(existingItem);
    //     } else {
    //         const newCartItem = this.cartItemRepo.create({
    //             cart,
    //             product,
    //             quantity,
    //             price: effectivePrice,
    //             size: size,
    //         });
    //         await this.cartItemRepo.save(newCartItem);
    //     }

    //     const items = await this.cartItemRepo.find({
    //         where: { cart: { id: cart.id } },
    //         relations: ['product', 'product.category'],
    //     });

    //     const itemsWithTotals = items.map((item) => {
    //         const effectivePrice = item.product.offerPrice && item.product.offerPrice > 0
    //             ? Number(item.product.offerPrice)
    //             : Number(item.product.price);

    //         const totalAmount = effectivePrice * item.quantity;

    //         return {
    //             id: item.id,
    //             size: item.size,
    //             product: {
    //                 id: item.product.id,
    //                 name: item.product.name,
    //                 price: Number(item.product.price),
    //                 offer: item.product.offer ? `${item.product.offer}%` : null,
    //                 offerPrice: item.product.offerPrice ?? null,
    //                 category: item.product.categoryId,
    //                 categoryName: item.product.category.name,
    //                 image: item.product.imageUrls,
    //                 description: item.product.description,
    //             },
    //             quantity: item.quantity,
    //             totalAmount: Number(totalAmount.toFixed(2)),
    //         };
    //     });

    //     const totalProductPrice = itemsWithTotals.reduce((sum, item) => sum + item.totalAmount, 0);

    //     return {
    //         statusCode: 201,
    //         message: 'Cart updated successfully',
    //         data: {
    //             items: itemsWithTotals,
    //             totalProductPrice: Number(totalProductPrice.toFixed(2)),
    //         },
    //     };
    // }










    // async getCart(user: User) {
    //     const cart = await this.cartRepo.findOne({
    //         where: { user: { id: user.id } },
    //         relations: ['items', 'items.product', 'user'],
    //     });

    //     if (!cart || cart.items.length === 0) {
    //         return {
    //             statusCode: 200,
    //             message: 'Cart is empty. Please add items to cart.',
    //         };
    //     }


    //     const items = cart.items.map((item) => {
    //         const price = parseFloat(String(item.product.price));
    //         const totalAmount = price * item.quantity;


    //         return {
    //             ...item,
    //             totalAmount,

    //         };
    //     });

    //     const grandTotal = items.reduce((sum, item) => sum + item.totalAmount, 0);

    //     return {
    //         statusCode: 200,
    //         message: 'Cart fetched successfully.',
    //         cart: {
    //             ...cart,
    //             items,
    //             grandTotal,
    //         },
    //     };
    // }


    async addToCart(user: User, dto: AddToCartDto) {
        let cart = await this.cartRepo.findOne({
            where: { user: { id: user.id } },
            relations: ['items', 'items.product', 'items.variant'],
        });

        if (!cart) {
            cart = this.cartRepo.create({ user, items: [] });
            await this.cartRepo.save(cart);
        }

        const product = await this.productRepo.findOne({
            where: { id: dto.productId },
            relations: ['variants', 'category'],
        });

        if (!product) throw new NotFoundException(`Product ID ${dto.productId} not found`);

        const quantity = dto.quantity ?? 1;
        if (quantity <= 0) throw new BadRequestException('Quantity must be positive');
        if (!dto.size) throw new BadRequestException('Size must be provided');

        const variant = product.variants.find((v) => v.size === dto.size);
        if (!variant) throw new BadRequestException(`No variant found for size: ${dto.size}`);
        if (variant.stock < quantity) throw new BadRequestException(`Only ${variant.stock} available`);

        const effectivePrice = Number(variant.price);

        const existingItem = cart.items.find(
            (item) => item.product.id === product.id && item.variant.id === variant.id
        );

        if (existingItem) {
            if (variant.stock < existingItem.quantity + quantity) {
                throw new BadRequestException(`Only ${variant.stock} available for size: ${dto.size}`);
            }
            existingItem.quantity += quantity;
            await this.cartItemRepo.save(existingItem);
        } else {
            const newCartItem = this.cartItemRepo.create({
                cart,
                product,
                variant,
                size: dto.size,
                quantity,
                price: effectivePrice, 
            });
            await this.cartItemRepo.save(newCartItem);
        }

        const items = await this.cartItemRepo.find({
            where: { cart: { id: cart.id } },
            relations: ['product', 'variant', 'product.category'],
        });

        const itemsWithTotals = items.map((item) => {
            const totalAmount = Number(item.price) * item.quantity;
            return {
                id: item.id,
                size: item.size,
                product: {
                    id: item.product.id,
                    name: item.product.name,
                    category: item.product.categoryId,
                    categoryName: item.product.category.name,
                    image: item.product.imageUrls,
                    description: item.product.description,
                },
                variant: {
                    id: item.variant.id,
                    size: item.variant.size,
                    stock: item.variant.stock,
                    price: Number(item.variant.price),
                },
                quantity: item.quantity,
                price: Number(item.price),
                totalAmount: Number(totalAmount.toFixed(2)),
            };
        });

        const totalProductPrice = itemsWithTotals.reduce((sum, i) => sum + i.totalAmount, 0);

        return {
            statusCode: 201,
            message: 'Cart updated successfully',
            data: {
                items: itemsWithTotals,
                totalProductPrice: Number(totalProductPrice.toFixed(2)),
            },
        };
    }



    // async addToCart(
    //     user: User,
    //     dto: AddToCartDto
    // ): Promise<{ statusCode: number; message: string; data: any }> {
    //     let cart = await this.cartRepo.findOne({
    //         where: { user: { id: user.id } },
    //         relations: ['items', 'items.product'],
    //     });

    //     if (!cart) {
    //         cart = this.cartRepo.create({ user, items: [], Price: 0, totalProductPrice: 0 });
    //         await this.cartRepo.save(cart);
    //     }

    //     const product = await this.productRepo.findOne({
    //         where: { id: dto.productId },
    //         relations: ['variants', 'category'],
    //     });

    //     if (!product) {
    //         throw new NotFoundException(`Product ID ${dto.productId} not found`);
    //     }

    //     const quantity = dto.quantity ?? 1;
    //     const size = dto.size;

    //     if (quantity <= 0) {
    //         throw new BadRequestException('Quantity must be a positive number');
    //     }

    //     if (!size) {
    //         throw new BadRequestException('Size must be provided');
    //     }

    //     const variant = product.variants.find(v => v.size === size);

    //     if (!variant) {
    //         throw new BadRequestException(`No variant found for size: ${size}`);
    //     }

    //     if (variant.stock <= 0 || variant.stock < quantity) {
    //         throw new BadRequestException(`Out of stock for size: ${size}`);
    //     }

    //     const effectivePrice = product.offerPrice && product.offerPrice > 0
    //         ? Number(product.offerPrice)
    //         : Number(product.price);

    //     const existingItem = cart.items.find(
    //         (item) => item.product.id === dto.productId && item.size === size
    //     );

    //     if (existingItem) {
    //         if (variant.stock < existingItem.quantity + quantity) {
    //             throw new BadRequestException(`Only ${variant.stock} items available for size: ${size}`);
    //         }
    //         existingItem.quantity += quantity;
    //         existingItem.price = effectivePrice;
    //         await this.cartItemRepo.save(existingItem);
    //     } else {
    //         const newCartItem = this.cartItemRepo.create({
    //             cart,
    //             product,
    //             quantity,
    //             price: effectivePrice,
    //             size: size,
    //         });
    //         await this.cartItemRepo.save(newCartItem);
    //     }

    //     const items = await this.cartItemRepo.find({
    //         where: { cart: { id: cart.id } },
    //         relations: ['product', 'product.category'],
    //     });

    //     const itemsWithTotals = items.map((item) => {
    //         const effectivePrice = item.product.offerPrice && item.product.offerPrice > 0
    //             ? Number(item.product.offerPrice)
    //             : Number(item.product.price);

    //         const totalAmount = effectivePrice * item.quantity;

    //         return {
    //             id: item.id,
    //             size: item.size,
    //             product: {
    //                 id: item.product.id,
    //                 name: item.product.name,
    //                 price: Number(item.product.price),
    //                 offer: item.product.offer ? `${item.product.offer}%` : null,
    //                 offerPrice: item.product.offerPrice ?? null,
    //                 category: item.product.categoryId,
    //                 categoryName: item.product.category.name,
    //                 image: item.product.imageUrls,
    //                 description: item.product.description,
    //             },
    //             quantity: item.quantity,
    //             totalAmount: Number(totalAmount.toFixed(2)),
    //         };
    //     });

    //     const totalProductPrice = itemsWithTotals.reduce((sum, item) => sum + item.totalAmount, 0);

    //     return {
    //         statusCode: 201,
    //         message: 'Cart updated successfully',
    //         data: {
    //             items: itemsWithTotals,
    //             totalProductPrice: Number(totalProductPrice.toFixed(2)),
    //         },
    //     };
    // }



    // async getCart(user: User) {
    //     const cart = await this.cartRepo.findOne({
    //         where: { user: { id: user.id } },
    //         relations: ['items', 'items.product', 'user'],
    //     });

    //     if (!cart || cart.items.length === 0) {
    //         return {
    //             statusCode: 200,
    //             message: 'Cart is empty. Please add items to cart.',
    //         };
    //     }

    //     const items = cart.items.map((item) => {

    //         const effectivePrice =
    //             item.product.offerPrice && Number(item.product.offerPrice) > 0
    //                 ? Number(item.product.offerPrice)
    //                 : Number(item.product.price);

    //         const totalAmount = effectivePrice * item.quantity;

    //         return {
    //             ...item,
    //             price: effectivePrice,
    //             totalAmount: Number(totalAmount.toFixed(2)),
    //         };
    //     });

    //     const totalProductPrice = items.reduce((sum, item) => sum + item.totalAmount, 0);

    //     return {
    //         statusCode: 200,
    //         message: 'Cart fetched successfully.',
    //         cart: {
    //             ...cart,
    //             items,
    //             Price: totalProductPrice,
    //             totalAmount: totalProductPrice,
    //             totalProductPrice: totalProductPrice,
    //             grandTotal: Number(totalProductPrice.toFixed(2)),
    //         },
    //     };
    // }

    async getCart(user: User) {
        const cart = await this.cartRepo.findOne({
            where: { user: { id: user.id } },
            relations: ['items', 'items.product', 'items.variant', 'user'],
        });

        if (!cart || cart.items.length === 0) {
            return {
                statusCode: 200,
                message: 'Cart is empty. Please add items to cart.',
            };
        }

        const items = cart.items.map((item) => {
        
            const effectivePrice = Number(item.variant.price);

            const totalAmount = effectivePrice * item.quantity;

            return {
                id: item.id,
                size: item.size,
                quantity: item.quantity,
                price: effectivePrice,
                totalAmount: Number(totalAmount.toFixed(2)),

                product: {
                    id: item.product.id,
                    name: item.product.name,
                    description: item.product.description,
                    category: item.product.categoryId,
                    categoryName: item.product.category?.name,
                    image: item.product.imageUrls,
                },

                variant: {
                    id: item.variant.id,
                    size: item.variant.size,
                    stock: item.variant.stock,
                    price: Number(item.variant.price),
                },
            };
        });

        const totalProductPrice = items.reduce((sum, item) => sum + item.totalAmount, 0);

        return {
            statusCode: 200,
            message: 'Cart fetched successfully.',
            cart: {
                id: cart.id,
                user: { id: cart.user.id, name: cart.user.name },
                items,
                totalProductPrice: Number(totalProductPrice.toFixed(2)),
                grandTotal: Number(totalProductPrice.toFixed(2)),
            },
        };
    }




    async removeCart(user: User, dto: UpdateCartDto): Promise<any> {
        if (!dto.productId || !dto.variantId) {
            throw new BadRequestException('productId and variantId must be provided');
        }

        const cart = await this.cartRepo.findOne({
            where: { user: { id: user.id } },
            relations: ['items', 'items.product', 'items.variant'],
        });

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        const cartItem = await this.cartItemRepo.findOne({
            where: {
                cart: { id: cart.id },
                product: { id: dto.productId },
                variant: { id: dto.variantId },
            },
            relations: ['product', 'variant'],
        });

        if (!cartItem) {
            throw new NotFoundException('Product/variant not found in your cart');
        }

        if (dto.quantity !== undefined) {
            if (dto.quantity <= 0) {
                throw new BadRequestException('Quantity must be a positive number');
            }

            cartItem.quantity -= dto.quantity;

            if (cartItem.quantity <= 0) {
                await this.cartItemRepo.remove(cartItem);
            } else {
                await this.cartItemRepo.save(cartItem);
            }
        } else {
            await this.cartItemRepo.remove(cartItem);
        }

        const updatedItems = await this.cartItemRepo.find({
            where: { cart: { id: cart.id } },
            relations: ['product', 'variant'],
        });

        const itemsWithTotals = updatedItems.map((item) => {
            const price = Number(item.variant.price);
            const totalAmount = price * item.quantity;

            return {
                id: item.id,
                product: {
                    id: item.product.id,
                    name: item.product.name,
                },
                variant: {
                    id: item.variant.id,
                    size: item.variant.size,
                    stock: item.variant.stock,
                    price: Number(item.variant.price),
                },
                quantity: item.quantity,
                totalAmount: Number(totalAmount.toFixed(2)),
            };
        });

        const grandTotal = itemsWithTotals.reduce((sum, item) => sum + item.totalAmount, 0);

        return {
            message: 'Cart updated successfully',
            cart: {
                id: cart.id,
                items: itemsWithTotals,
                grandTotal: Number(grandTotal.toFixed(2)),
            },
        };
    }

}

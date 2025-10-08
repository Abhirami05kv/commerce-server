import { forwardRef, Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { Cart } from './enity/cart.entity';
import { CartItem } from './enity/cart.item.entity';
import { Product } from 'src/product/entity/product.entity';
import { User } from 'src/auth/entity/auth.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { ProductVariant } from 'src/product/entity/product-variant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem, Product, User, ProductVariant]),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
  ],
  providers: [CartService],
  exports: [CartService, TypeOrmModule],
  controllers: [CartController],
})
export class CartModule { }

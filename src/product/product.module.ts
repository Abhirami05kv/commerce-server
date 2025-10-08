import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { Product } from './entity/product.entity';
import { Category } from 'src/category/entity/category.entity';
import { Order } from 'src/order/entity/order.entity';
import { OrderItem } from 'src/order/entity/order-item.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Product, Category, OrderItem]),
    ],
    controllers: [ProductController],
    providers: [ProductService],
    exports: [ProductService],
})
export class ProductModule { }

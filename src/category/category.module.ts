import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Product } from 'src/product/entity/product.entity';

@Module({

    imports: [TypeOrmModule.forFeature([Category, Product])],
    controllers: [CategoryController],
    providers: [CategoryService]
})
export class CategoryModule {
}

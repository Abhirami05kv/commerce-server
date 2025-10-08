import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Order } from '../order/entity/order.entity';
import { Product } from '../product/entity/product.entity';
import { User } from 'src/auth/entity/auth.entity';


@Module({
    imports: [TypeOrmModule.forFeature([Order, Product, User])],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule { }

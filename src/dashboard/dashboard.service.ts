import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../order/entity/order.entity';
import { Product } from '../product/entity/product.entity';
import { User } from 'src/auth/entity/auth.entity';


@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async getDashboardStats() {

        const totalSalesResult = await this.orderRepository
            .createQueryBuilder('order')
            .select('SUM(order.grandTotal)', 'totalSales')
            .getRawOne();

        const totalSales = Number(totalSalesResult.totalSales) || 0;


        const totalProducts = await this.productRepository.count();


        const totalUsers = await this.userRepository.count();


        const totalPendingOrders = await this.orderRepository.count({
            where: { status: OrderStatus.PENDING },
        });

        return {
            totalSales,
            totalProducts,
            totalUsers,
            totalPendingOrders,
        };
    }
}

// // import { Module } from '@nestjs/common';
// // import { OrderService } from './orders.service';
// // import { OrderController } from './orders.controller';
// // import { TypeOrmModule } from '@nestjs/typeorm';
// // import { Order} from './entities/order.entity';
// // import { User } from 'src/auth/entities/auth.entity';
// // import { CartModule } from 'src/cart/cart.module';
// // import { Address } from 'src/auth/entities/address.entity';
// // import { Cart } from 'src/cart/entities/cart.entity';
// // import { OrderItem } from './entities/order-item.entity';
// // import { PaymentModule } from 'src/payment/payment.module';
// // import { Product } from 'src/products/entities/product.entity';
// // import { forwardRef } from '@nestjs/common';
// // import { CartService } from 'src/cart/cart.service';
// // import { PaymentService } from 'src/payment/payment.service';

// // @Module({
// //   imports: [
// //     TypeOrmModule.forFeature([Order, OrderItem, User,Cart, Address,Product]), 
// //     forwardRef(() => CartModule),
// //     forwardRef(() => PaymentModule),
// //   ],
// //   controllers: [OrderController], 
// //   providers: [OrderService, CartService, PaymentService],
// //   exports: [OrderService,TypeOrmModule], 
// // })
// // export class OrdersModule {}


// import { Module, forwardRef } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { OrderService } from './orders.service';
// import { OrderController } from './orders.controller';
// import { Order } from './entities/order.entity';
// import { User } from 'src/auth/entities/auth.entity';
// import { CartModule } from 'src/cart/cart.module';
// import { Address } from 'src/auth/entities/address.entity';
// import { Cart } from 'src/cart/entities/cart.entity';
// import { OrderItem } from './entities/order-item.entity';
// import { PaymentModule } from 'src/payment/payment.module';
// import { Product } from 'src/products/entities/product.entity';
// import { CartService } from 'src/cart/cart.service';
// import { PaymentService } from 'src/payment/payment.service';
// import { Coupon } from 'src/coupons/entities/coupon.entity';
// import { OrderReturnRequest } from './order-return-request.entity';
// import { GiftCard } from 'src/gitfcard/entities/gift-card.entity';


// @Module({
//   imports: [
//     TypeOrmModule.forFeature([Order, OrderItem, User,Cart, Address,Product, Coupon,OrderReturnRequest]), 
//     forwardRef(() => CartModule),
//     forwardRef(() => PaymentModule),


//   ],
//   controllers: [OrderController],
//   providers: [OrderService, CartService, PaymentService], 
//   exports: [OrderService, TypeOrmModule],
// })
// export class OrdersModule {}


import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartModule } from 'src/cart/cart.module';
import { CartService } from 'src/cart/cart.service';
import { Order } from './entity/order.entity';
import { OrderItem } from './entity/order-item.entity';
import { User } from 'src/auth/entity/auth.entity';
import { Cart } from 'src/cart/enity/cart.entity';
import { Address } from 'src/auth/entity/address.entity';
import { Product } from 'src/product/entity/product.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PaymentsModule } from 'src/payment/payment.module';
import { ProductVariant } from 'src/product/entity/product-variant.entity';



@Module({
    imports: [
        TypeOrmModule.forFeature([
            Order,
            OrderItem,
            User,
            Cart,
            Address,
            Product,
            ProductVariant
        ]),
        forwardRef(() => CartModule),
        forwardRef(() => PaymentsModule),
        // forwardRef(() => MailModule),
        // GiftCardModule, NotificationModule
    ],
    controllers: [OrderController],
    providers: [OrderService, CartService,],
    exports: [OrderService, TypeOrmModule],
})
export class OrdersModule { }
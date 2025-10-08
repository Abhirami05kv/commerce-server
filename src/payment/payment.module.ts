// payment.module.ts

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { Order } from 'src/order/entity/order.entity';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from 'src/order/order.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order]),
        ConfigModule,
        forwardRef(() => OrdersModule)
    ],
    controllers: [PaymentController],
    providers: [PaymentService],
    exports: [PaymentService],
})
export class PaymentsModule { }

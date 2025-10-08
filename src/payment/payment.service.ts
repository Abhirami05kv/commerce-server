import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Order } from 'src/order/entity/order.entity';
import * as crypto from 'crypto';

const Razorpay = require('razorpay');

@Injectable()
export class PaymentService {
    private razorpay: any;

    constructor(
        @InjectRepository(Order)
        private orderRepo: Repository<Order>,
        private configService: ConfigService,
    ) {
        this.razorpay = new Razorpay({
            key_id: this.configService.get('RAZORPAY_KEY_ID'),
            key_secret: this.configService.get('RAZORPAY_KEY_SECRET'),
        });
    }

    async createRazorpayOrder(orderId: number) {
        if (!orderId) {
            throw new BadRequestException('Order ID is required');
        }

        const order = await this.orderRepo.findOne({ where: { id: orderId } });

        if (!order) throw new NotFoundException('Order not found');

        if (order.razorpayOrderId) {
            return {
                message: 'Payment already created for this order',
                razorpayOrderId: order.razorpayOrderId,
                amount: Number(order.grandTotal).toFixed(2), 
                currency: 'INR',
                orderId: order.id,
                key: this.configService.get('RAZORPAY_KEY_ID'),
            };
        }

        const options = {
            amount: Math.round(Number(order.grandTotal) * 100), 
            currency: 'INR',
            receipt: `order_rcptid_${order.id}`,
            payment_capture: 1,
        };

        const razorpayOrder = await this.razorpay.orders.create(options);

        order.razorpayOrderId = razorpayOrder.id;
        await this.orderRepo.save(order);

        return {
            message: 'Payment created successfully',
            razorpayOrderId: razorpayOrder.id,
            amount: Number(order.grandTotal).toFixed(2),
            currency: 'INR',
            orderId: order.id,
            key: this.configService.get('RAZORPAY_KEY_ID'),
        };
    }





    async verifyPayment(data: {
        razorpayOrderId: string;
        razorpayPaymentId: string;
        razorpaySignature: string;
        orderId: number;
    }) {
        const {
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            orderId,
        } = data;

        const body = `${razorpayOrderId}|${razorpayPaymentId}`;
        const expectedSignature = crypto
            .createHmac('sha256', this.configService.get('RAZORPAY_KEY_SECRET') ?? '')
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpaySignature) {
            throw new Error('Invalid signature');
        }

        const order = await this.orderRepo.findOne({ where: { id: orderId } });
        if (!order) throw new Error('Order not found');

        order.paymentStatus = 'Paid';
        order.paymentId = razorpayPaymentId;
        order.razorpayOrderId = razorpayOrderId;
        order.razorpaySignature = razorpaySignature;

        await this.orderRepo.save(order);

        return { message: 'Payment successful', order };
    }

}

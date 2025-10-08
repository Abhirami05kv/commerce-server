
import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('api/payments')
export class PaymentController {
    constructor(private paymentService: PaymentService) { }

    @Post('create')
    createRazorpayOrder(@Body('orderId') orderId: number) {
        return this.paymentService.createRazorpayOrder(orderId);
    }

    @Post('verify')
    verifyPayment(@Body() body: any) {
        return this.paymentService.verifyPayment(body);
    }
}

import { BadRequestException, Body, Controller, Get, InternalServerErrorException, NotFoundException, Param, ParseIntPipe, Post, Put, Query, Req, Res, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/types/request.type';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { OrderService } from './order.service';
import { User } from 'src/auth/entity/auth.entity';
import { UpdateOrderStatusDto } from './dto/update-order.dto';
import { Response } from 'express';


@Controller('api/order')
export class OrderController {
    constructor(private readonly orderService: OrderService,) { }

    @UseGuards(AuthGuard('jwt'))
    @Post('create')
    async createOrder(
        @Req() req: AuthenticatedRequest,
        @Body() createOrderDto: CreateOrderDto,
    ) {
        const user = req.user;

        if (!user?.id) {
            throw new UnauthorizedException({
                statusCode: 401,
                message: 'User authentication failed.',
            });
        }

        const orderResponse = await this.orderService.createOrder(user, createOrderDto);

        return {
            statusCode: 201,
            message: 'Order created successfully',
            orderId: orderResponse.orderId,
            data: orderResponse.orderDetails,
        };
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('my-orders')
    async getUserOrders(@Req() req: Request & { user: User }) {
        if (!req.user) {
            throw new UnauthorizedException({
                statusCode: 401,
                message: 'User authentication failed.',
            });
        }

        try {
            const orderResponse = await this.orderService.getUserOrders(req.user);

            return {
                statusCode: 200,
                success: true,
                message: orderResponse.message,
                orders: orderResponse.orders,

            };
        } catch (error) {
            console.error('Error retrieving user orders:', error);

            if (error instanceof NotFoundException) {
                throw new NotFoundException({
                    statusCode: 404,
                    message: error.message || 'No orders found for this user.',
                });
            }

            throw new InternalServerErrorException({
                statusCode: 500,
                message: 'An unexpected error occurred while retrieving orders.',
            });
        }
    }


    @Get()
    async getAllOrders(
        @Query('userId') userId?: number,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('orderId') orderId?: string, 
    ) {
        return this.orderService.getAllOrders(
            userId ? Number(userId) : undefined,
            startDate,
            endDate,
            Number(page) || 1,
            Number(limit) || 10,
            orderId ? Number(orderId) : undefined,
        );
    }

    @Put(':orderId/status')
    async updateOrderStatus(
        @Param('orderId') orderId: number,
        @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    ) {
        return this.orderService.updateOrderStatus(
            orderId,
            updateOrderStatusDto.status,
        );
    }


    @Get(':orderId/invoice')
    async getInvoice(@Param('orderId') orderId: number, @Res() res: Response) {
        try {
            const pdfBuffer = await this.orderService.generateInvoice(orderId);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="invoice_${orderId}.pdf"`);

            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).send({ message: 'Error generating invoice', error: error.message });
        }
    }


}

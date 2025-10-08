import { Controller, Post, Body, UseGuards, Req, Delete, Param, ParseIntPipe, Patch, Get, BadRequestException } from '@nestjs/common';
import { CartService } from './cart.service';

import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


import { UpdateCartDto } from './dto/update-cart.dto';
import { AddToCartDto } from './dto/add-to-cart-dto';
import { User } from 'src/auth/entity/auth.entity';
import { AuthenticatedRequest } from 'src/types/request.type';

@Controller('api/cart')
export class CartController {
    constructor(private cartService: CartService) { }


    @Post('add')
    @UseGuards(JwtAuthGuard)
    async addToCart(@Req() req, @Body() dto: AddToCartDto) {
        if (!req.user || !req.user.id) {
            throw new BadRequestException('User is not authenticated');
        }
        return this.cartService.addToCart(req.user, dto);
    }




    @UseGuards(JwtAuthGuard)
    @Get('get')
    async getCart(@Req() req: AuthenticatedRequest) {
        const user = req.user;
        return this.cartService.getCart(user);
    }

    @Patch('remove')
    @UseGuards(JwtAuthGuard)
    async modifyCart(@Req() req: AuthenticatedRequest, @Body() dto: UpdateCartDto) {
        const user = req.user;
        return this.cartService.removeCart(user, dto);
    }



}

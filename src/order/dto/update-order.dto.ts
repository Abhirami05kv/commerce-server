import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '../entity/order.entity';


export class UpdateOrderStatusDto {
    @IsNotEmpty()
    @IsEnum(OrderStatus)
    status: OrderStatus;

    @IsOptional()
    @IsString()
    reason: string;
}
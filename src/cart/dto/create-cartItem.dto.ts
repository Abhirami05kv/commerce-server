import { IsNumber, IsPositive } from 'class-validator';

export class CreateCartItemDto {
    @IsNumber()
    @IsPositive()
    productId: number;

    quantity: number;
}
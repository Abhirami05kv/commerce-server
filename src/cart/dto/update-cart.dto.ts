import { IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateCartDto {

    @IsNotEmpty()
    @IsInt()
    productId: number;

    @IsNumber()
    @IsOptional()
    @Min(0)
    quantity?: number;

    @IsInt()
    variantId: number;
}




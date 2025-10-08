import { IsArray, ValidateNested, IsInt, Min, IsNotEmpty, IsNumber, IsOptional, IsIn, isNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { Size } from '../enum/size.enum';




export class AddToCartDto {
    @IsNotEmpty()
    @IsNumber()
    productId: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    quantity?: number;


    @IsNotEmpty()
    size: Size;


}

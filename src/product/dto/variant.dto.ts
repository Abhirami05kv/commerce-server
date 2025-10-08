import { IsEnum, IsNumber } from 'class-validator';
import { Size } from 'src/cart/enum/size.enum';

export class VariantDto {
    @IsEnum(Size)
    size: Size;

    @IsNumber()
    stock: number;
}

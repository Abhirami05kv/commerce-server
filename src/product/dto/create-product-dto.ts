import { Transform, Type } from 'class-transformer';
import { IsString, IsNumber, IsArray, IsOptional, IsNotEmpty, ValidateNested, IsBoolean } from 'class-validator';
import { off } from 'process';
import { Size } from 'src/cart/enum/size.enum';
import { FindOperator } from 'typeorm';



class VariantDto {
    size: Size;
    stock: number;
    @Type(() => Number)
    @IsNumber()
    price: number;
}

export class CreateProductDto {
    @IsString()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    price: number;

    // @IsNumber()
    // @IsNotEmpty()
    // @Type(() => Number)
    // stock: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    imageUrls?: string[];

    @IsString()
    @IsOptional()
    status?: string;

    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    categoryId: number;

    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            return Number(value.replace('%', '').trim());
        }
        return Number(value);
    })
    @IsNumber()
    offer?: number;


    // @IsNotEmpty()
    // size: Size;


    @IsArray()
    @ValidateNested({ each: true, })
    @Type(() => VariantDto)
    variants: VariantDto[];

    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            return value.toLowerCase() === 'true';
        }
        return Boolean(value);
    })
    @IsBoolean()
    bestseller?: boolean;

}


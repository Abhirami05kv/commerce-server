

import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product-dto';
import { IsOptional, IsNotEmpty, IsNumber, IsString, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Size } from 'src/cart/enum/size.enum';

export class UpdateVariantDto {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsOptional()
    @IsNumber()
    stock?: number;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    size?: string;

    @IsOptional()
    @IsString()
    status?: string;
}


// export class UpdateProductDto extends PartialType(CreateProductDto) {
//     @IsOptional()
//     @IsString()
//     @IsNotEmpty({ message: 'Product name cannot be empty' })
//     name?: string;

//     @IsOptional()
//     @IsNumber()
//     price?: number;

//     @IsOptional()
//     @IsString()

//     description?: string;

//     @IsOptional()
//     @IsNumber()
//     categoryId?: number;

//     // @IsOptional()
//     // @IsNumber()
//     // stock?: number;

//     @IsArray()
//     @IsString()
//     @IsOptional()
//     imageUrls?: string;

//     @IsOptional()
//     @IsString()
//     status?: string | undefined;

//     @IsOptional()
//     @IsNumber()
//     @Type(() => Number)
//     offer?: number;

//     // @IsOptional()
//     // size: Size;

//     @IsOptional()
//     @IsArray()
//     @ValidateNested({ each: true })
//     @Type(() => UpdateVariantDto)
//     variants?: UpdateVariantDto[];
// }

export class UpdateProductDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsNumber()
    price?: number;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    categoryId?: number;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === undefined || value === null || value === '') {
            return undefined;
        }
        if (typeof value === 'string') {
            return Number(value.replace('%', '').trim());
        }
        return Number(value);
    })
    @IsNumber()
    offer?: number;


    // @IsOptional()
    // @IsString()
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    imageUrls?: string[];


    @IsOptional()
    @Transform(({ value }) => {
        if (!value) return undefined;
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            } catch {
                throw new Error('Invalid JSON for variants');
            }
        }
        return value;
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateVariantDto)
    variants?: UpdateVariantDto[];


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



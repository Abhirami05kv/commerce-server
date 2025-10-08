import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateBannerDto {

    @IsOptional()
    @IsString()
    name?: string;


    @IsOptional()
    bannerImage?: string;

    @IsOptional()
    productImage?: string;


    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    offer?: number;
}
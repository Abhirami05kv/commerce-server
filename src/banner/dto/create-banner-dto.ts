import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateBannerDto {

    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    bannerImage: string;

    @IsOptional()
    productImage: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    offer?: number;
}
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsDateString, IsNumber } from 'class-validator';

export class CreateOfferDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    message?: string;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    customerId?: number;
}

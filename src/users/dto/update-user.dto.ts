
import { IsOptional, IsString, IsEmail, IsPhoneNumber, ValidateNested, IsArray, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from 'src/auth/dto/address.dto';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    phoneNumber?: string;

    // @IsOptional()
    // @IsString()
    // role?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AddressDto)
    address?: AddressDto[];

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;

    // @IsString()
    // deviceToken: string;
}
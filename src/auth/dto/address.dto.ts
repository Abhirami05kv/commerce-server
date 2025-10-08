import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, Length, IsEmail, IsOptional, IsArray, ValidateNested } from 'class-validator';

export class AddressDto {
    @IsString()
    @IsNotEmpty()
    street: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsNotEmpty()
    addressOne: string;

    @IsString()
    @IsOptional()
    addressTwo: string;

    @IsString()
    @IsNotEmpty()
    zipCode: string;

}

export class CreateUserDto {
    @IsNotEmpty()
    @Length(3, 20)
    username: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Length(6, 20)
    password: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AddressDto)
    address?: AddressDto[];

}

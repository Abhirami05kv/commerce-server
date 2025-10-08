import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Matches, Max, Min, ValidateNested } from 'class-validator';
import { AddressDto } from 'src/auth/dto/address.dto';

export class CreateUserDto {
    @IsNotEmpty()
    @Length(3, 20)
    @IsString()
    username: string;

    @IsEmail()
    @IsString()
    email: string;

    @IsNotEmpty()
    @Length(6, 20)
    @IsString()
    password: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AddressDto)
    address?: AddressDto[];


    @IsString({ message: 'Phone number must be a string' })
    @Length(8, 12, { message: 'Phone number must be within 12 digits' })
    @Matches(/^[0-9]+$/, { message: 'Phone number must contain only digits' })
    phoneNumber: string;
}
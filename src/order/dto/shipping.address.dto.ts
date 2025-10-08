import { ValidateNested, IsOptional, IsNotEmpty, IsString, Length } from 'class-validator';


export class ShippingAddressDto {


    @IsNotEmpty({ message: 'City is required' })
    @IsString({ message: 'City must be a valid string' })
    @Length(2, 100, { message: 'City must be between 2 and 100 characters' })
    city: string;

    @IsNotEmpty({ message: 'State is required' })
    @IsString({ message: 'State must be a valid string' })
    @Length(2, 100, { message: 'State must be between 2 and 100 characters' })
    addressOne: string;

    @IsOptional({ message: 'Country is required' })
    @IsString({ message: 'Country must be a valid string' })
    @Length(2, 100, { message: 'Country must be between 2 and 100 characters' })
    addressTwo: string;

    @IsNotEmpty({ message: 'Zip code is required' })
    @IsString({ message: 'Zip code must be a string' })
    // @Matches(/^\d{6}$/, { message: 'Enter a valid zip code (exactly 6 digits)' })
    zipCode: string;
}
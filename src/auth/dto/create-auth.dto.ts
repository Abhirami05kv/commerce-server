
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    MinLength,
    IsPhoneNumber,
    IsEnum,
    IsArray,
    ValidateNested,
    Matches,
    Length,
    IsAlpha,
    Validate,
    ValidationArguments,
    IsBoolean,
    IsInt,
    Min,
    Max,
} from 'class-validator';
import { Exclude, Type } from 'class-transformer';
import { UserRole } from '../user-role.enum';
import { AddressDto } from './address.dto';
import { isValidEmailFormat } from 'src/utils/email-utils';


export class IsEmailCustom {
    validate(email: string, args: ValidationArguments) {
        return isValidEmailFormat(email);
    }

    defaultMessage(args: ValidationArguments) {
        return 'Invalid email format';
    }
}

export class RegisterDto {
    @IsString()
    @IsNotEmpty({ message: 'Name is required' })
    @Matches(/^[A-Za-z ]+$/, { message: 'Name can only contain alphabetic characters and spaces' })
    @Length(3, 50, { message: 'Name should be between 3 and 50 characters' })
    name: string;

    @IsNotEmpty({ message: 'Email is required' })
    @IsNotEmpty({ message: 'Email is required' })
    @Matches(/^[a-z]+[0-9]*@[a-z]+\.[a-z]+$/, { message: 'Invalid email format' })
    email: string;


    @IsString({ message: 'Password must be a string' })
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    @Matches(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    @Matches(/[0-9]/, { message: 'Password must contain at least one number' })
    @Matches(/[\W]/, { message: 'Password must contain at least one special character' })
    password: string;


    @IsString({ message: 'Phone number must be a string' })
    @Length(8, 12, { message: 'Phone number must be within 12 digits' })
    @Matches(/^[0-9]+$/, { message: 'Phone number must contain only digits' })
    phoneNumber: string;


    @IsEnum(UserRole, { message: 'Invalid role type' })
    @IsOptional()
    role?: UserRole = UserRole.USER;

    @IsString()
    @IsOptional()
    @Exclude()
    googleId?: string;

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;


    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AddressDto)
    @IsOptional()
    @Exclude()
    address?: AddressDto[];
}

export class LoginDto {
    @IsEmail({}, { message: 'Email must be valid' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    // deviceToken?:string;
}

export class SendOtpDto {
    @Validate(IsEmailCustom, { message: 'Invalid email format' })
    email: string;
}

export class VerifyOtpDto {
    @Validate(IsEmailCustom, { message: 'Invalid email format' })
    email: string;

    @IsString()
    @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
    @Matches(/^\d{6}$/, { message: 'OTP must contain only numbers' })
    otp: string;
}

export class ForgotPasswordDto {
    @Validate(IsEmailCustom, { message: 'Invalid email format' })
    email: string;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    @Matches(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    @Matches(/[0-9]/, { message: 'Password must contain at least one number' })
    @Matches(/[\W]/, { message: 'Password must contain at least one special character' })
    newPassword: string;

    @IsString()
    @IsNotEmpty({ message: 'Confirm password is required' })
    confirmPassword: string;
}

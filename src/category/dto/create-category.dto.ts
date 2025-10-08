import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export enum Status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsEnum(Status)
    @IsNotEmpty()
    status: Status;
}

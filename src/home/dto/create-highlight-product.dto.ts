import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateHighlightProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;
}
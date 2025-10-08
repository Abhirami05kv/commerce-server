import { IsOptional, IsString } from "class-validator";

export class UpdateHighlightProductDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;
}
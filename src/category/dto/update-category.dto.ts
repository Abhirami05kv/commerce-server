import { isEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Status } from "./create-category.dto";

export class UpdateCategoryDto {

    @IsOptional()
    @IsString()
    name?: string;


    @IsString()
    @IsOptional()
    description?: string;

    @IsOptional()

    status?: Status;
}
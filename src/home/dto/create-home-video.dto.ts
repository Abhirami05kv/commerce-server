import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateHomeVideoDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;
}

import { IsOptional, IsString } from 'class-validator';

export class UpdateHomeVideoDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;
}

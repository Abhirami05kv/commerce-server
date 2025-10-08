import { IsArray, ArrayNotEmpty, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class DeleteDto {
    @IsArray()
    @ArrayNotEmpty()
    @Type(() => Number)
    @IsInt({ each: true })
    ids: number[];
}


import { IsArray, ArrayNotEmpty, IsInt } from 'class-validator';

export class DeleteHighlightProductDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    ids: number[];
}

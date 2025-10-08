import { IsArray, ArrayNotEmpty, IsNumber } from 'class-validator';

export class DeleteHomeVideoDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsNumber({}, { each: true })
    ids: number[];
}

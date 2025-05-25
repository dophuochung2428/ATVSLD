import { IsArray, ArrayNotEmpty, IsNumber } from 'class-validator';

export class DeleteManyDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  ids: number[];
}

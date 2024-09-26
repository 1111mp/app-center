import { IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryAppDto {
  @Min(1)
  @IsNumber()
  @Type(() => Number)
  pageNum: number;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  pageSize: number;
}

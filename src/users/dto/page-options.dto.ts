import { Type } from 'class-transformer';
import { IsInt, Min, IsOptional } from 'class-validator';

export class PageOptionsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 25;
}

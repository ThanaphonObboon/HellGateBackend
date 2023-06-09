import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class RequestPageParam {
  constructor() {
    this.setDefaultValues();
  }
  @Transform((value) => Number(value))
  @IsNumber()
  pageSize: number;
  @Transform((value) => Number(value))
  @IsNumber()
  page: number;
  @IsString()
  basicFilter: string;
  private setDefaultValues() {
    this.pageSize = 15;
    this.page = 1;
    this.basicFilter = '';
  }
}

export class PagedResult<T> {
  items: T[] = [];
  @ApiProperty({ type: Number })
  @Transform((value) => Number(value))
  @IsNumber()
  thisPages = 0;
  @ApiProperty({ type: Number })
  @Transform((value) => Number(value))
  @IsNumber()
  totalPages = 0;
  @ApiProperty({ type: Number })
  @Transform((value) => Number(value))
  @IsNumber()
  totalItems = 0;
  @ApiProperty({ type: Number })
  @Transform((value) => Number(value))
  @IsNumber()
  pageSizes = 0;
}

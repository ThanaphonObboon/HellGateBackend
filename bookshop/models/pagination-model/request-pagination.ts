import { IsNumber, IsString } from 'class-validator';

export class RequestPageParam {
  constructor() {
    this.page = 1;
    this.pageSize = 15;
    this.basicFilter = '';
  }
  @IsNumber()
  pageSize: number;
  @IsNumber()
  page: number;
  @IsString()
  basicFilter: string;
}

export class PagedResult<T> {
  items: T[] = [];
  @IsNumber()
  thisPages = 0;
  @IsNumber()
  totalPages = 0;
  @IsNumber()
  totalItems = 0;
  @IsNumber()
  pageSizes = 0;
}

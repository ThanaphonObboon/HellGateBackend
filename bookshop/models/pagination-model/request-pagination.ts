export class RequestPageParam {
  constructor() {
    this.page = 1;
    this.pageSize = 15;
    this.basicFilter = '';
  }
  pageSize: number;
  page: number;
  basicFilter: string;
}

export class PagedResult<T> {
  items: T[] = [];
  thisPages = 0;
  totalPages = 0;
  totalItems = 0;
  pageSizes = 0;
}

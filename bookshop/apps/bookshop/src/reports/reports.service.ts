import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BookDto, BookReportDto } from 'models/book-model/book-model.dto';
import {
  PostReportSalesCategoryDto,
  ReportSalesCategoryDto,
  ReportUserModelDto,
} from 'models/report-model/report-model.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ReportsService {
  constructor(@Inject('BOOK_SERVICE') private client: ClientProxy) {}

  async getSalesHistoryReport(
    body: PostReportSalesCategoryDto,
  ): Promise<ReportSalesCategoryDto[]> {
    const result = this.client.send<ReportSalesCategoryDto[]>(
      { cmd: 'service.book.reports.sales' },
      body,
    );
    return await lastValueFrom(result);
  }

  async getSaleNoReport(
    body: PostReportSalesCategoryDto,
  ): Promise<BookReportDto[]> {
    const result = this.client.send<BookReportDto[]>(
      { cmd: 'service.book.reports.sales.no' },
      body,
    );
    return await lastValueFrom(result);
  }
  async getBookStockReport(sort: number): Promise<BookDto[]> {
    const result = this.client.send<BookDto[]>(
      { cmd: 'service.book.reports.stock' },
      sort,
    );
    return await lastValueFrom(result);
  }
  async getBuyBookRanking(): Promise<ReportUserModelDto[]> {
    const result = this.client.send<ReportUserModelDto[]>(
      { cmd: 'service.book.reports.Ranking' },
      {},
    );
    return await lastValueFrom(result);
  }
}

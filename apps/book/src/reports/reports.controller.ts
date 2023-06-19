import { Controller } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import {
  PostReportSalesCategoryDto,
  ReportSalesCategoryDto,
  ReportUserModelDto,
} from 'models/report-model/report-model.dto';
import { BookDto, BookReportDto } from 'models/book-model/book-model.dto';

@Controller()
export class ReportsController {
  constructor(private readonly _reportSerive: ReportsService) {}

  @MessagePattern({ cmd: 'service.book.reports.sales' })
  async getSalesHistoryReport(
    @Payload() payload: PostReportSalesCategoryDto,
  ): Promise<ReportSalesCategoryDto[]> {
    try {
      return await this._reportSerive.getSalesHistoryReport(payload);
    } catch (e) {
      throw new RpcException(e.message);
    }
  }
  @MessagePattern({ cmd: 'service.book.reports.sales.no' })
  async getSaleNoReport(
    @Payload() payload: PostReportSalesCategoryDto,
  ): Promise<BookReportDto[]> {
    try {
      return await this._reportSerive.getSaleNoReport(payload);
    } catch (e) {
      throw new RpcException(e.message);
    }
  }

  @MessagePattern({ cmd: 'service.book.reports.stock' })
  async getBookStockReport(): Promise<boolean> {
    try {
      await this._reportSerive.getBuyBookRanking();
      return true;
    } catch (e) {
      throw new RpcException(e.message);
    }
  }
  @MessagePattern({ cmd: 'service.book.reports.Ranking' })
  async getBuyBookRanking(): Promise<ReportUserModelDto[]> {
    try {
      return await this._reportSerive.getBuyBookRanking();
    } catch (e) {
      throw new RpcException(e.message);
    }
  }
}

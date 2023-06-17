import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { helperService } from '@app/common/helps/helper.service';
import { HttpResponseMessage } from '@app/common';
import { CustomValidationPipe } from 'pipes/custom-validation.pipe';
import { PostReportSalesCategoryDto } from 'models/report-model/report-model.dto';

@Controller('api/reports')
export class ReportsController {
  constructor(
    private readonly _reportService: ReportsService,
    private readonly _httpMessage: HttpResponseMessage,
  ) {}
  @Post('sales')
  async getSalesHistoryReport(
    @Body(new CustomValidationPipe()) body: PostReportSalesCategoryDto,
  ) {
    try {
      console.log(body);
      // console.log(new Date().getHours());
      const res = await this._reportService.getSalesHistoryReport(body);
      return this._httpMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Post('sales/no')
  async getSalesNoHistoryReport(
    @Body(new CustomValidationPipe()) body: PostReportSalesCategoryDto,
  ) {
    try {
      const res = await this._reportService.getSaleNoReport(body);
      return this._httpMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Get('stock')
  async getBookStockReport(
    @Query('sort', new DefaultValuePipe(-1), new ParseIntPipe()) sort: number,
  ) {
    try {
      const res = await this._reportService.getBookStockReport(sort);
      return this._httpMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Get('buy/ranking')
  async getBuyBookRanking() {
    try {
      const res = await this._reportService.getBuyBookRanking();
      return this._httpMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  // @Get('stock')
  // async getBuyBookRanking() {
  //   try {
  //     const res = await this._reportService.getBuyBookRanking();
  //     return this._httpMessage.Ok(res);
  //   } catch (e) {
  //     throw new BadRequestException(e.message);
  //   }
  // }
}

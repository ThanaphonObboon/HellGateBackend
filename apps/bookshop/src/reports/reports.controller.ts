import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { helperService } from '@app/common/helps/helper.service';
import { HttpResponseMessage } from '@app/common';
import { CustomValidationPipe } from 'pipes/custom-validation.pipe';
import {
  PostReportSalesCategoryDto,
  ReportSalesCategoryDto,
  ReportUserModelDto,
} from 'models/report-model/report-model.dto';
import { AuthGuard } from '@app/common/helps/auth.guard';
import { UserRole } from '@app/common/helps/role.enum';
import { Roles } from '@app/common/helps/roles.decorator';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { BookDto, BookReportDto } from 'models/book-model/book-model.dto';

@ApiTags('reports')
@UseGuards(AuthGuard)
@Roles(UserRole.Admin)
@Controller('api/reports')
export class ReportsController {
  constructor(
    private readonly _reportService: ReportsService,
    private readonly _httpMessage: HttpResponseMessage,
  ) {}

  @ApiOkResponse({
    description: 'success',
    type: [ReportSalesCategoryDto],
  })
  @ApiBearerAuth()
  @Post('sales')
  async getSalesHistoryReport(
    @Body(new CustomValidationPipe()) body: PostReportSalesCategoryDto,
  ) {
    try {
      const res = await this._reportService.getSalesHistoryReport(body);
      return this._httpMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @ApiOkResponse({
    description: 'success',
    type: [BookReportDto],
  })
  @ApiBearerAuth()
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
  @ApiOkResponse({
    description: 'success',
    type: [BookDto],
  })
  @ApiBearerAuth()
  @ApiQuery({ name: 'sort', required: false, type: String })
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
  @ApiOkResponse({
    description: 'success',
    type: [ReportUserModelDto],
  })
  @ApiBearerAuth()
  @Get('buy/ranking')
  async getBuyBookRanking() {
    try {
      const res = await this._reportService.getBuyBookRanking();
      return this._httpMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}

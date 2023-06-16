import { helperService } from '@app/common/helps/helper.service';
import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Book } from 'schema/book.schema';
import { SalesHistory } from 'schema/sales-history';
import { StockHistory } from 'schema/stock-history.schema';

@Injectable()
export class ReportsService {
  constructor(
    // @InjectModel(Book.name) private readonly _book: Model<Book>,
    // @InjectModel(StockHistory.name)
    // private readonly _stockHistory: Model<StockHistory>,
    @InjectModel(SalesHistory.name)
    private readonly _salesHistory: Model<SalesHistory>,
    private readonly _helper: helperService,
  ) {}

  async getSalesHistory(startDate: Date, endDate: Date): Promise<any> {
    return null;
  }
}

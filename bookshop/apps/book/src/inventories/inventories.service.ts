import { helperService } from '@app/common/helps/helper.service';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { StockHistoryDto } from 'models/Inventories-model/Inventories-model.dto';
import {
  PagedResult,
  RequestPageParam,
} from 'models/pagination-model/request-pagination';
import { Connection, Model, Types } from 'mongoose';
import { Book } from 'schema/book.schema';
import { StockHistory } from 'schema/stock-history.schema';

@Injectable()
export class InventoriesService {
  constructor(
    @InjectModel(Book.name) private readonly _book: Model<Book>,
    @InjectModel(StockHistory.name)
    private readonly _stockHistory: Model<StockHistory>,
    @InjectConnection() private readonly connection: Connection,
    private readonly _helper: helperService,
  ) {}
  async adjustInventories(bookId: string, amount: number): Promise<void> {
    console.log('payload', bookId, amount);
    const transactionSession = await this.connection.startSession();
    transactionSession.startTransaction();
    try {
      if (!Types.ObjectId.isValid(bookId))
        throw new Error('รูปแบบของรหัสไม่ถูกต้อง');
      const book = await this._book.findOne({
        _id: new Types.ObjectId(bookId),
        status: { $ne: 'D' },
      });
      if (!book) throw new Error('ไม่พบข้อมูล');
      const history = await this._stockHistory.create({
        actionType: 'A',
        amount: amount - book.stock,
        oldstock: book.stock,
        createdAt: new Date(),
        stock: amount,
      });
      book.stock = amount;
      await book.save();
      await history.save();
      await transactionSession.commitTransaction();
    } catch (error) {
      await transactionSession.abortTransaction();
      throw new Error(error.message);
    } finally {
      await transactionSession.endSession();
    }
    // return this._helper.plainToClass(BookDto, book[0]);
  }
  async getStockHistory(
    bookId: string,
    param: RequestPageParam,
  ): Promise<PagedResult<StockHistoryDto>> {
    const options: any = {
      status: {
        $ne: 'D',
      },
    };
    const sortOption: any = {
      createdAt: -1,
    };
    if (param.basicFilter) {
      options.$or = [
        { author: new RegExp(param.basicFilter.toString().trim(), 'i') },
        { title: new RegExp(param.basicFilter.toString().trim(), 'i') },
        { description: new RegExp(param.basicFilter.toString().trim(), 'i') },
      ];
    }
    if (Types.ObjectId.isValid(bookId))
      options.bookId = new Types.ObjectId(bookId);
    param.page = Number(param.page) || 1;
    param.pageSize = Number(param.pageSize) || 15;
    param.page = param.page <= 0 ? 1 : param.page;
    param.pageSize =
      param.pageSize <= 0 || param.pageSize > 1000 ? 15 : param.pageSize;
    const page = new PagedResult<StockHistoryDto>();
    const count = await this._stockHistory
      .aggregate([
        {
          $lookup: {
            from: 'books', // ชื่อคอลเล็กชันที่ต้องการเชื่อมโยง
            localField: 'bookId', // ชื่อคอลเล็กชันในการเชื่อมโยง
            foreignField: '_id',
            as: 'book', // ชื่อตัวแปรที่จะเก็บผลลัพธ์
          },
        },
        {
          $match: options, // เงื่อนไขที่ตรงกับเอกสาร
        },
        {
          $count: 'totalItems', // นับจำนวนเอกสารที่ตรงกับเงื่อนไข
        },
      ])
      .exec();
    // const query = this._userModel.find(options);
    page.totalItems = count.length > 0 ? count[0].totalItems : 0;
    // console.log(page.totalItems);
    page.thisPages = param.page;
    page.pageSizes = param.pageSize;
    page.totalPages = Math.ceil(
      Number(page.totalItems) / Number(page.pageSizes),
    );
    const skip = (page.thisPages - 1) * page.pageSizes;
    const items = await this._book
      .aggregate([
        {
          $lookup: {
            from: 'books',
            localField: 'bookId',
            foreignField: '_id',
            as: 'book',
          },
        },
        {
          $match: options,
        },
        {
          $sort: sortOption,
        },
        {
          $skip: skip,
        },
        {
          $limit: page.pageSizes,
        },
      ])
      .exec();
    page.items = [];
    items.forEach((item) => {
      const model = this._helper.plainToClass(StockHistoryDto, item);
      page.items.push(model);
    });
    return page;
  }
}

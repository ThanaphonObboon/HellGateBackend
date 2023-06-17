import { helperService } from '@app/common/helps/helper.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SalesHistory } from 'schema/sales-history';
import {
  PostReportSalesCategoryDto,
  ReportSalesCategoryDto,
  ReportSalesCategoryDto2,
  ReportUserModelDto,
} from 'models/report-model/report-model.dto';
import * as moment from 'moment-timezone';
import { BookDto, BookReportDto } from 'models/book-model/book-model.dto';
import { Book } from 'schema/book.schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Book.name) private readonly _book: Model<Book>,
    // @InjectModel(StockHistory.name)
    // private readonly _stockHistory: Model<StockHistory>,
    @InjectModel(SalesHistory.name)
    private readonly _salesHistory: Model<SalesHistory>,
    private readonly _helper: helperService,
  ) {}

  async getSalesHistoryReport(
    body: PostReportSalesCategoryDto,
  ): Promise<ReportSalesCategoryDto[]> {
    const pipelines: any[] = [
      {
        $lookup: {
          from: 'books',
          localField: 'bookId',
          foreignField: '_id',
          as: 'book',
        },
      },
      {
        $unwind: '$book',
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'book.categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$category',
      },
      {
        $group: {
          _id: {
            categoryId: '$category._id',
            categoryName: '$category.categoryName',
          },
          totalSales: { $sum: 1 },
        },
      },
      {
        $project: {
          categoryId: '$_id.categoryId',
          categoryName: '$_id.categoryName',
          totalSales: '$totalSales',
        },
      },
      {
        $sort: {
          totalSales: body.sort == 1 ? 1 : -1,
        },
      },
    ];
    if (body.startDate && body.endDate) {
      body.startDate = moment(body.startDate).utcOffset(7).toDate();
      body.endDate = moment(body.endDate).utcOffset(7).toDate();
      console.log(moment().toDate());
      pipelines.unshift({
        $match: {
          createdAt: {
            $gte: new Date(body.startDate),
            $lte: new Date(body.endDate),
          },
        },
      });
    }
    const report = await this._salesHistory.aggregate(pipelines).exec();
    const listReportSalesCategoryDto: ReportSalesCategoryDto[] = report.map(
      (item) => this._helper.plainToClass(ReportSalesCategoryDto, item),
    );
    return listReportSalesCategoryDto;
  }

  async getSaleNoReport(
    body: PostReportSalesCategoryDto,
  ): Promise<BookReportDto[]> {
    const pipelines: any[] = [
      {
        $lookup: {
          from: 'books',
          localField: 'bookId',
          foreignField: '_id',
          as: 'book',
        },
      },
      {
        $unwind: '$book',
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'book.categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$category',
      },
      {
        $group: {
          _id: {
            bookId: '$bookId',
            categoryId: '$category._id',
            categoryName: '$category.categoryName',
            author: '$book.author',
            title: '$book.title',
            description: '$book.description',
          },
          totalSales: { $sum: 1 },
        },
      },
      {
        $project: {
          bookId: '$_id.bookId',
          categoryId: '$_id.categoryId',
          categoryName: '$_id.categoryName',
          author: '$_id.author',
          title: '$_id.title',
          description: '$_id.description',
          totalSales: '$totalSales',
        },
      },
      {
        $sort: {
          totalSales: body.sort == 1 ? 1 : -1,
        },
      },
    ];
    if (body.startDate && body.endDate) {
      body.startDate = moment(body.startDate).utcOffset(7).toDate();
      body.endDate = moment(body.endDate).utcOffset(7).toDate();
      console.log(moment().toDate());
      pipelines.unshift({
        $match: {
          createdAt: {
            $gte: new Date(body.startDate),
            $lte: new Date(body.endDate),
          },
        },
      });
    }
    const report = await this._salesHistory.aggregate(pipelines).exec();
    console.log(report);
    const listReportSales: BookReportDto[] = report.map((item) =>
      this._helper.plainToClass(BookReportDto, item),
    );
    return listReportSales;
  }

  async getBookStockReport(sort: number): Promise<BookDto[]> {
    const options: any = {
      status: {
        $ne: 'D',
      },
    };
    const sortOption: any = {
      stock: sort == 1 ? 1 : -1,
    };
    const items = await this._book
      .aggregate([
        {
          $lookup: {
            from: 'categories',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'category',
          },
        },
        {
          $match: options,
        },
        {
          $sort: sortOption,
        },
      ])
      .exec();
    const data = items.map((item) =>
      this._helper.plainToClass<BookDto>(BookDto, item),
    );
    return data;
  }

  async getBuyBookRanking(): Promise<ReportUserModelDto[]> {
    const pipelines: any[] = [
      {
        $lookup: {
          from: 'books',
          localField: 'bookId',
          foreignField: '_id',
          as: 'book',
        },
      },
      {
        $unwind: '$book',
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'book.categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$category',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $group: {
          _id: {
            userId: '$userId',
            fullName: '$user.fullName',
            username: '$user.username',
          },
          totalBook: { $sum: 1 },
          totalPrice: { $sum: '$price' },
          bookLists: {
            $push: '$$ROOT',
          },
        },
      },
      {
        $project: {
          userId: '$_id.userId',
          fullName: '$_id.fullName',
          username: '$_id.username',
          totalBook: '$totalBook',
          totalPrice: '$totalPrice',
          bookLists: '$bookLists',
        },
      },
      {
        $sort: {
          totalBook: -1,
        },
      },
    ];
    const reports = await this._salesHistory.aggregate(pipelines).exec();
    const members: ReportUserModelDto[] = [];
    for (const report of reports) {
      const member: ReportUserModelDto = new ReportUserModelDto();
      member.fullName = report.fullName;
      member.username = report.username;
      member.totalBook = report.totalBook;
      member.userId = report.userId.toString();
      member.bookCategories = [];
      for (const book of report.bookLists) {
        const category = member.bookCategories.find(
          (x) => x.categoryId == book.category._id.toString(),
        );
        if (!category) {
          const newCategory = new ReportSalesCategoryDto2();
          newCategory.categoryId = book.category._id.toString();
          newCategory.categoryName = book.category.categoryName;
          newCategory.totalBook = 1;
          newCategory.totalPrice = book.price;
          member.bookCategories.push(newCategory);
          continue;
        }
        category.totalBook += 1;
        category.totalPrice += book.price;
      }
      members.push(member);
    }
    return members;
  }
}

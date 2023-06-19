import { helperService } from '@app/common/helps/helper.service';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import { log } from 'console';
import { CreateBookDto } from 'models/book-model/book-create-model.dto';
import { BookDto, UserBookDto } from 'models/book-model/book-model.dto';
import {
  PagedResult,
  RequestPageParam,
} from 'models/pagination-model/request-pagination';
import { Connection, Model, Types } from 'mongoose';
import { Book } from 'schema/book.schema';
import { Category } from 'schema/category.schema';
import { SalesHistory } from 'schema/sales-history';
import { UserBook } from 'schema/user-book';
import { User } from 'schema/user.schema';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name) private _book: Model<Book>,
    @InjectModel(User.name) private _user: Model<User>,
    @InjectModel(UserBook.name) private _userBook: Model<UserBook>,
    @InjectModel(SalesHistory.name) private _salesHistory: Model<SalesHistory>,
    @InjectModel(Category.name) private _category: Model<Category>,
    private readonly _helper: helperService,
    @InjectConnection() private readonly connection: Connection,
  ) {}
  async getBooks(
    param: RequestPageParam,
    categoryId: string,
    sortbyStock: number,
    sortbyPrice: number,
  ): Promise<PagedResult<BookDto>> {
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
        {
          'category.categoryName': new RegExp(
            param.basicFilter.toString().trim(),
            'i',
          ),
        },
      ];
    }
    if (categoryId) options.categoryId = this._helper.toObjectId(categoryId);
    if (sortbyPrice && sortbyPrice != 0) sortOption.price = sortbyPrice;
    if (sortbyStock && sortbyStock != 0) sortOption.stock = sortbyStock;
    param.page = Number(param.page) || 1;
    param.pageSize = Number(param.pageSize) || 15;
    param.page = param.page <= 0 ? 1 : param.page;
    param.pageSize =
      param.pageSize <= 0 || param.pageSize > 1000 ? 15 : param.pageSize;
    const page = new PagedResult<BookDto>();
    const count = await this._book
      .aggregate([
        {
          $lookup: {
            from: 'categories', // ชื่อคอลเล็กชันที่ต้องการเชื่อมโยง
            localField: 'categoryId',
            foreignField: '_id',
            as: 'category',
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
      const model = this._helper.plainToClass<BookDto>(BookDto, item);
      // model._id = item._id.toString();
      // model.categoryName = item?.category[0]?.categoryName;
      page.items.push(model);
    });
    return page;
  }

  async getBookById(id: string): Promise<BookDto> {
    if (!Types.ObjectId.isValid(id)) throw new Error('รูปแบบของรหัสไม่ถูกต้อง');
    const book = await this._book.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: 'categoryId',
          as: 'category',
        },
      },
      { $match: { _id: new Types.ObjectId(id), status: 'A' } },
      { $limit: 1 },
    ]);
    if (book.length == 0) throw new Error('ไม่พบข้อมูล');
    return this._helper.plainToClass(BookDto, book[0]);
  }

  async createBook(req: CreateBookDto): Promise<BookDto> {
    const transactionSession = await this.connection.startSession();
    transactionSession.startTransaction();
    try {
      if (req.categoryId && !Types.ObjectId.isValid(req.categoryId))
        throw new Error('รูปแบบของรหัสไม่ถูกต้อง');
      const category = await this._category.findOne({
        _id: new Types.ObjectId(req.categoryId),
        status: 'A',
      });
      if (!category) throw new Error('ไม่พบหมวดหมู่');
      const book = await this._book.create({
        author: req.author,
        title: req.title,
        description: req.description,
        price: req.price,
        status: 'A',
        stock: 0,
        categoryId: category._id,
      });
      const result = await book.save();
      category.bookInCategory = await this._book
        .countDocuments({
          categoryId: category._id,
          status: 'A',
        })
        .lean();
      await category.save();
      await transactionSession.commitTransaction();
      return this._helper.plainToClass<BookDto>(BookDto, result.toObject());
    } catch (err) {
      await transactionSession.abortTransaction();
      throw new Error(err.message);
    } finally {
      await transactionSession.endSession();
    }
  }

  async updateBook(id: string, req: CreateBookDto): Promise<void> {
    const transactionSession = await this.connection.startSession();
    transactionSession.startTransaction();
    try {
      if (req.categoryId && !Types.ObjectId.isValid(req.categoryId))
        throw new Error('รูปแบบของรหัสไม่ถูกต้อง');
      const category = await this._category.findOne({
        _id: new Types.ObjectId(req.categoryId),
        status: 'A',
      });
      if (!category) throw new Error('ไม่พบหมวดหมู่');
      const book = await this._book.findOne({
        _id: new Types.ObjectId(id),
        status: 'A',
      });
      if (!book) throw new Error('ไม่พบข้อมูล');
      book.author = req.author;
      book.title = req.title;
      book.description = req.description;
      book.price = req.price;
      book.categoryId = category._id;
      await book.save();
      category.bookInCategory = await this._book
        .countDocuments({
          categoryId: category._id,
          status: 'A',
        })
        .lean();
      await category.save();
      await transactionSession.commitTransaction();
    } catch (err) {
      await transactionSession.abortTransaction();
      throw new Error(err.message);
    } finally {
      await transactionSession.endSession();
    }
  }

  async deleteBook(id: string): Promise<void> {
    const transactionSession = await this.connection.startSession();
    transactionSession.startTransaction();
    try {
      if (!Types.ObjectId.isValid(id))
        throw new Error('รูปแบบของรหัสไม่ถูกต้อง');
      const book = await this._book.findOne({
        _id: new Types.ObjectId(id),
        status: 'A',
      });
      if (!book) throw new Error('ไม่พบข้อมูล');
      book.status = 'D';
      await book.save();
      const category = await this._category.findOne({
        _id: new Types.ObjectId(id),
      });
      if (category) {
        category.bookInCategory = await this._book
          .countDocuments({
            categoryId: category._id,
            status: 'A',
          })
          .lean();
        await category.save();
      }
      await transactionSession.commitTransaction();
    } catch (err) {
      await transactionSession.abortTransaction();
      throw new Error(err.message);
    } finally {
      await transactionSession.endSession();
    }
  }

  async userbuyBook(userId: string, bookId: string): Promise<void> {
    const transactionSession = await this.connection.startSession();
    transactionSession.startTransaction();
    try {
      if (!Types.ObjectId.isValid(bookId) || !Types.ObjectId.isValid(userId))
        throw new Error('รูปแบบของรหัสไม่ถูกต้อง');
      const book = await this._book.findOne({
        _id: new Types.ObjectId(bookId),
        status: 'A',
      });
      if (!book) throw new Error('ไม่พบข้อมูล');
      if (book.stock <= 0) throw new Error('หนังสือหมด');
      const user = await this._user.findOne({
        _id: new Types.ObjectId(userId),
        status: 'A',
      });
      if (!user) throw new Error('ไม่พบข้อมูล');
      const ownerBook = await this._userBook.findOne({
        bookId: new Types.ObjectId(bookId),
        userId: new Types.ObjectId(userId),
      });
      if (ownerBook) throw new Error('มีหนังสืออยู่แล้ว');
      const userBook = await this._userBook.create({
        userId: user._id,
        bookId: book._id,
        buyAt: new Date(),
      });
      const salesHistory = await this._salesHistory.create({
        bookId: book._id,
        userId: user._id,
        price: book.price,
        createdAt: new Date(),
      });
      book.stock--;
      user.bookOwnerCount++;
      user.lastPurchaseDate = new Date();
      await salesHistory.save();
      await userBook.save();
      await book.save();
      await user.save();
      await transactionSession.commitTransaction();
    } catch (err) {
      await transactionSession.abortTransaction();
      throw new Error(err.message);
    } finally {
      await transactionSession.endSession();
    }
  }

  async ownerBook(
    userId: string,
    param: RequestPageParam,
  ): Promise<PagedResult<UserBookDto>> {
    const options: any = {
      userId: new Types.ObjectId(userId),
    };
    const sortOption: any = {
      createdAt: -1,
    };
    param.page = Number(param.page) || 1;
    param.pageSize = Number(param.pageSize) || 15;
    param.page = param.page <= 0 ? 1 : param.page;
    param.pageSize =
      param.pageSize <= 0 || param.pageSize > 1000 ? 15 : param.pageSize;
    const page = new PagedResult<UserBookDto>();
    const count = await this._userBook
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
          $lookup: {
            from: 'categories', // ชื่อคอลเล็กชันที่ต้องการเชื่อมโยง
            localField: 'book.categoryId',
            foreignField: '_id',
            as: 'category',
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
    page.thisPages = param.page;
    page.pageSizes = param.pageSize;
    page.totalPages = Math.ceil(
      Number(page.totalItems) / Number(page.pageSizes),
    );
    const skip = (page.thisPages - 1) * page.pageSizes;
    const items = await this._userBook
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
          $lookup: {
            from: 'categories',
            localField: 'book.categoryId',
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
        {
          $skip: skip,
        },
        {
          $limit: page.pageSizes,
        },
      ])
      .exec();
    page.items = items.map((item) =>
      this._helper.plainToClass(UserBookDto, item),
    );
    return page;
  }
}

import { helperService } from '@app/common/helps/helper.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import { log } from 'console';
import { CreateBookDto } from 'models/book-model/book-create-model.dto';
import { BookDto } from 'models/book-model/book-model.dto';
import {
  PagedResult,
  RequestPageParam,
} from 'models/pagination-model/request-pagination';
import { Model, Types } from 'mongoose';
import { Book } from 'schema/book.schema';
import { Category } from 'schema/category.schema';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name) private _book: Model<Book>,
    @InjectModel(Category.name) private _category: Model<Category>,
    private readonly _helper: helperService,
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
    // console.log('sortOption', sortOption);
    // await new Promise((resolve, _) => {
    //   setTimeout(() => resolve(true), 2000);
    // });
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
      // console.log(item);
      const model = plainToClass(BookDto, item, {
        excludeExtraneousValues: true,
      });
      // model._id = item._id.toString();
      // model.categoryName = item?.category[0]?.categoryName;
      page.items.push(model);
    });
    return page;
  }

  async createBook(req: CreateBookDto): Promise<BookDto> {
    if (req.categoryId && !Types.ObjectId.isValid(req.categoryId))
      throw new Error('รูปแบบของรหัสไม่ถูกต้อง');
    const category = await this._category.findOne({
      _id: new Types.ObjectId(req.categoryId),
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
    category.bookInCategory += 1;
    await category.save();
    return plainToClass(BookDto, result.toObject());
  }
}

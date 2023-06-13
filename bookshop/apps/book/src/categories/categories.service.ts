import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import {
  CategoryDto,
  CreateCategoryDto,
} from 'models/category-model/category-model.dto';
import {
  PagedResult,
  RequestPageParam,
} from 'models/pagination-model/request-pagination';
import { UserModelDto } from 'models/user-model/user-model.dto';
import { Model, Types } from 'mongoose';
import { Category } from 'schema/category.schema';
import { User } from 'schema/user.schema';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private _category: Model<Category>) {}
  async getCategories(
    param: RequestPageParam,
  ): Promise<PagedResult<CategoryDto>> {
    let options: any = {};
    options = {
      status: {
        $ne: 'D',
      },
    };
    if (param.basicFilter) {
      options.$or = [
        { categoryName: new RegExp(param.basicFilter.toString().trim(), 'i') },
      ];
    }
    // await new Promise((resolve, _) => {
    //   setTimeout(() => resolve(true), 2000);
    // });
    param.page = Number(param.page) || 1;
    param.pageSize = Number(param.pageSize) || 15;
    param.page = param.page <= 0 ? 1 : param.page;
    param.pageSize =
      param.pageSize <= 0 || param.pageSize > 1000 ? 15 : param.pageSize;
    const page = new PagedResult<CategoryDto>();
    // const query = this._userModel.find(options);
    page.totalItems = await this._category.countDocuments(options).exec();
    page.thisPages = param.page;
    page.pageSizes = param.pageSize;
    page.totalPages = Math.ceil(
      Number(page.totalItems) / Number(page.pageSizes),
    );
    const skip = (page.thisPages - 1) * page.pageSizes;
    const items = await this._category
      .find(options)
      .lean()
      .skip(skip)
      .limit(page.pageSizes)
      .exec();
    page.items = [];
    console.log(items);
    items.forEach((item) => {
      const model = plainToClass(CategoryDto, item);
      model._id = item._id.toString();
      page.items.push(model);
    });
    console.log(page.items);
    return page;
  }

  async getCategoryById(id: string): Promise<CategoryDto> {
    if (!Types.ObjectId.isValid(id)) throw new Error('รูปแบบของรหัสไม่ถูกต้อง');
    const category: Category = await this._category
      .findOne({
        _id: new Types.ObjectId(id),
        status: {
          $ne: 'D',
        },
      })
      .lean()
      .exec();
    if (!category) throw new Error('ไม่พบข้อมูลหมวดหมู่');
    return plainToClass(CategoryDto, category);
  }

  async createCategory(val: CreateCategoryDto): Promise<CategoryDto> {
    const category: Category = await this._category
      .findOne({
        categoryName: {
          $regex: new RegExp('^' + val.categoryName + '$', 'i'),
        },
        status: {
          $ne: 'D',
        },
      })
      .lean()
      .exec();
    if (category) throw new Error('มีหมวดหมู่นี้มีอยู่ในระบบแล้ว');
    const categoryDocument = new this._category({
      bookInCategory: 0,
      creeatedAt: new Date(),
      categoryName: val.categoryName,
      status: 'A',
    });
    const data = await categoryDocument.save();
    return plainToClass(CategoryDto, data);
  }

  async updateCategory(id: string, val: CreateCategoryDto): Promise<void> {
    if (!Types.ObjectId.isValid(id)) throw new Error('รูปแบบของรหัสไม่ถูกต้อง');
    const foundCategory: Category = await this._category
      .findOne({
        _id: { $ne: new Types.ObjectId(id) },
        categoryName: {
          $regex: new RegExp('^' + val.categoryName + '$', 'i'),
        },
        status: {
          $ne: 'D',
        },
      })
      .lean()
      .exec();
    if (foundCategory) throw new Error('มีหมวดหมู่นี้มีอยู่ในระบบแล้ว');
    const category = await this._category
      .findOne({
        _id: new Types.ObjectId(id),
        status: {
          $ne: 'D',
        },
      })
      .exec();
    if (!category) throw new Error('ไม่พบข้อมูลหมวดหมู่');
    category.categoryName = val.categoryName;
    category.updatedAt = new Date();
    await category.save();
  }
  async deleteCategory(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) throw new Error('รูปแบบของรหัสไม่ถูกต้อง');
    const category = await this._category
      .findOne({
        _id: new Types.ObjectId(id),
        status: {
          $ne: 'D',
        },
      })
      .exec();
    if (!category) throw new Error('ไม่พบข้อมูลหมวดหมู่');
    category.status = 'D';
    category.updatedAt = new Date();
    await category.save();
  }
}

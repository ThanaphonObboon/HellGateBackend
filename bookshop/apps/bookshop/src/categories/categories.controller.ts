import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { HttpResponseMessage } from '@app/common';
import { RequestPageParam } from 'models/pagination-model/request-pagination';
import { CreateCategoryDto } from 'models/category-model/category-model.dto';
import { CustomValidationPipe } from 'pipes/custom-validation.pipe';

@Controller('api/categories')
export class CategoriesController {
  constructor(
    private _category: CategoriesService,
    private readonly _responseMessage: HttpResponseMessage,
  ) {}

  @Get()
  async getCategories(
    @Query('pageSize', ParseIntPipe) pageSize = 15,
    @Query('page', ParseIntPipe) page = 1,
    @Query('basicFilter') basicFilter = '',
  ) {
    try {
      const param = new RequestPageParam();
      param.page = page;
      param.pageSize = pageSize;
      param.basicFilter = basicFilter;
      const res = await this._category.getCategories(param);
      return this._responseMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: string) {
    try {
      const res = await this._category.getCategoryById(id);
      return this._responseMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Post()
  async createCategory(
    @Body(new CustomValidationPipe()) body: CreateCategoryDto,
  ) {
    try {
      const res = await this._category.createCategory(body);
      return this._responseMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() body: CreateCategoryDto,
  ) {
    try {
      const res = await this._category.updateCategory(id, body);
      return this._responseMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    try {
      const res = await this._category.deleteCategory(id);
      return this._responseMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}

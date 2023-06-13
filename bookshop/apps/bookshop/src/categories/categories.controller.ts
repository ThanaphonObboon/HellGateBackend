import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { HttpResponseMessage } from '@app/common';
import { RequestPageParam } from 'models/pagination-model/request-pagination';
import { CreateCategoryDto } from 'models/category-model/category-model.dto';
import { helperService } from '@app/common/helps/helper.service';
import { CustomValidationPipe } from 'pipes/custom-validation.pipe';

@Controller('api/categories')
export class CategoriesController {
  constructor(
    private _category: CategoriesService,
    private readonly _responseMessage: HttpResponseMessage,
    private readonly _helperService: helperService,
  ) {}

  @Get()
  async getCategories(@Query() param: RequestPageParam) {
    try {
      param = this._helperService.isEmptyObject(param)
        ? new RequestPageParam()
        : param;
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

  @Delete()
  async deleteCategory(id: string) {
    try {
      const res = await this._category.deleteCategory(id);
      return this._responseMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}

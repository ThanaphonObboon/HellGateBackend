import { Controller } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import {
  PagedResult,
  RequestPageParam,
} from 'models/pagination-model/request-pagination';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import {
  CategoryDto,
  CreateCategoryDto,
} from 'models/category-model/category-model.dto';

@Controller()
export class CategoriesController {
  constructor(private _categoriesService: CategoriesService) {}

  @MessagePattern({ cmd: 'service.book.categories' })
  async getCategories(
    @Payload() param: RequestPageParam,
  ): Promise<PagedResult<CategoryDto>> {
    try {
      return await this._categoriesService.getCategoriesAddCache(param);
    } catch (e) {
      throw new RpcException(e.message);
    }
  }

  @MessagePattern({ cmd: 'service.book.categories.id' })
  async getCategoryById(@Payload() id: string): Promise<CategoryDto> {
    try {
      return await this._categoriesService.getCategoryById(id);
    } catch (e) {
      throw new RpcException(e.message);
    }
  }
  @MessagePattern({ cmd: 'service.book.categories.create' })
  async createCategory(
    @Payload() payload: CreateCategoryDto,
  ): Promise<CategoryDto> {
    try {
      return await this._categoriesService.createCategory(payload);
    } catch (e) {
      throw new RpcException(e.message);
    }
  }
  @MessagePattern({ cmd: 'service.book.categories.update' })
  async updateCategory(
    @Payload() payload: { id: string; data: CreateCategoryDto },
  ): Promise<boolean> {
    try {
      await this._categoriesService.updateCategory(payload.id, payload.data);
      return true;
    } catch (e) {
      throw new RpcException(e.message);
    }
  }

  @MessagePattern({ cmd: 'service.book.categories.delete' })
  async deleteCategory(@Payload() id: string): Promise<boolean> {
    try {
      await this._categoriesService.deleteCategory(id);
      return true;
    } catch (e) {
      throw new RpcException(e.message);
    }
  }
}

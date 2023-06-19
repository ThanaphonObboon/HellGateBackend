import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CategoryDto,
  CreateCategoryDto,
} from 'models/category-model/category-model.dto';
import {
  RequestPageParam,
  PagedResult,
} from 'models/pagination-model/request-pagination';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CategoriesService {
  constructor(@Inject('BOOK_SERVICE') private client: ClientProxy) {}

  async getCategories(
    param: RequestPageParam,
  ): Promise<PagedResult<CategoryDto>> {
    const result = this.client.send<PagedResult<CategoryDto>>(
      { cmd: 'service.book.categories' },
      param,
    );
    return await lastValueFrom(result);
  }

  async getCategoryById(id: string): Promise<CategoryDto> {
    const result = this.client.send<CategoryDto>(
      { cmd: 'service.book.categories.id' },
      id,
    );
    return await lastValueFrom(result);
  }
  async createCategory(body: CreateCategoryDto): Promise<CategoryDto> {
    const result = this.client.send<CategoryDto>(
      { cmd: 'service.book.categories.create' },
      body,
    );
    return await lastValueFrom(result);
  }

  async updateCategory(id: string, body: CreateCategoryDto): Promise<void> {
    const result = this.client.send<boolean>(
      { cmd: 'service.book.categories.update' },
      { id, data: body },
    );
    await lastValueFrom(result);
  }

  async deleteCategory(id: string): Promise<void> {
    const result = this.client.send<boolean>(
      { cmd: 'service.book.categories.delete' },
      id,
    );
    await lastValueFrom(result);
  }
}

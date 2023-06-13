import { Controller, Get } from '@nestjs/common';
import { BookService } from './book.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CategoryDto } from 'models/category-model/category-model.dto';
import {
  RequestPageParam,
  PagedResult,
} from 'models/pagination-model/request-pagination';
import { BookDto } from 'models/book-model/book-model.dto';
import { CreateBookDto } from 'models/book-model/book-create-model.dto';
import { Types } from 'mongoose';

@Controller()
export class BookController {
  constructor(private readonly _bookService: BookService) {}

  @MessagePattern({ cmd: 'service.book.books' })
  async getBooks(
    @Payload()
    param: {
      param: RequestPageParam;
      categoryId: string;
      sortbyStock: number;
      sortbyPrice: number;
    },
  ): Promise<PagedResult<BookDto>> {
    try {
      return await this._bookService.getBooks(
        param.param,
        param.categoryId,
        param.sortbyPrice,
        param.sortbyStock,
      );
    } catch (e) {
      throw new RpcException(e.message);
    }
  }

  @MessagePattern({ cmd: 'service.book.books.create' })
  async createBook(@Payload() payload: CreateBookDto): Promise<BookDto> {
    try {
      return await this._bookService.createBook(payload);
    } catch (e) {
      throw new RpcException(e.message);
    }
  }
}

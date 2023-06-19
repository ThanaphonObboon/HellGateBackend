import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateBookDto } from 'models/book-model/book-create-model.dto';
import { BookDto } from 'models/book-model/book-model.dto';
import {
  PagedResult,
  RequestPageParam,
} from 'models/pagination-model/request-pagination';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class BooksService {
  constructor(@Inject('BOOK_SERVICE') private readonly client: ClientProxy) {}

  async getBooks(
    param: RequestPageParam,
    categoryId = '',
    sortbyStock = 0,
    sortbyPrice = 0,
  ): Promise<PagedResult<BookDto>> {
    const result = this.client.send<PagedResult<BookDto>>(
      { cmd: 'service.book.books' },
      { param, categoryId, sortbyStock, sortbyPrice },
    );
    return await lastValueFrom(result);
  }

  async getBookById(id: string): Promise<BookDto> {
    const result = this.client.send<BookDto>(
      { cmd: 'service.book.books.id' },
      id,
    );
    return await lastValueFrom(result);
  }

  async updateBook(id: string, body: CreateBookDto): Promise<void> {
    const result = this.client.send<boolean>(
      { cmd: 'service.book.books.update' },
      { id, body },
    );
    await lastValueFrom(result);
  }

  async deleteBook(id: string): Promise<void> {
    const result = this.client.send<boolean>(
      { cmd: 'service.book.books.delete' },
      id,
    );
    await lastValueFrom(result);
  }

  async createBook(payload: CreateBookDto): Promise<BookDto> {
    const result = this.client.send<BookDto>(
      { cmd: 'service.book.books.create' },
      payload,
    );
    return await lastValueFrom(result);
  }
  async ownerBook(userId: string, param: RequestPageParam): Promise<BookDto> {
    const result = this.client.send<BookDto>(
      { cmd: 'service.book.books.owner' },
      { userId, param },
    );
    return await lastValueFrom(result);
  }
  async userBuyBook(userId: string, bookId: string): Promise<BookDto> {
    const result = this.client.send<BookDto>(
      { cmd: 'service.book.books.buy' },
      { userId, bookId },
    );
    return await lastValueFrom(result);
  }
}

// @Query('pageSize', ParseIntPipe) pageSize = 15,
// @Query('page', ParseIntPipe) page = 1,
// @Query('basicFilter') basicFilter = '',

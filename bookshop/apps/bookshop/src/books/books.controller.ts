import { HttpResponseMessage } from '@app/common';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { RequestPageParam } from 'models/pagination-model/request-pagination';
import { BooksService } from './books.service';
import { CreateBookDto } from 'models/book-model/book-create-model.dto';
import { CustomValidationPipe } from 'pipes/custom-validation.pipe';

@Controller('api/books')
export class BooksController {
  constructor(
    private readonly _book: BooksService,
    private readonly _responseMessage: HttpResponseMessage,
  ) {}

  @Get()
  async getBooks(
    @Query('pageSize', ParseIntPipe) pageSize = 15,
    @Query('page', ParseIntPipe) page = 1,
    @Query('basicFilter') basicFilter = '',
    @Query('categoryId') categoryId = '',
    @Query('sortbyStock') sortbyStock = 0,
    @Query('sortbyPrice') sortbyPrice = 0,
  ) {
    try {
      const param = new RequestPageParam();
      param.page = page;
      param.pageSize = pageSize;
      param.basicFilter = basicFilter;
      console.log('param', param, categoryId, sortbyStock, sortbyPrice);
      const res = await this._book.getBooks(
        param,
        categoryId,
        sortbyStock,
        sortbyPrice,
      );
      return this._responseMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Post()
  async createBook(@Body(new CustomValidationPipe()) req: CreateBookDto) {
    try {
      const res = await this._book.createBook(req);
      return this._responseMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}

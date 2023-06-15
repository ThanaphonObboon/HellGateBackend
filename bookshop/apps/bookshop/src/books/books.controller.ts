import { HttpResponseMessage } from '@app/common';
import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
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
    @Query('pageSize', new DefaultValuePipe(15), ParseIntPipe) pageSize: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('basicFilter', new DefaultValuePipe('')) basicFilter: string,
    @Query('categoryId', new DefaultValuePipe('')) categoryId: string,
    @Query('sortbyStock', new DefaultValuePipe(0), ParseIntPipe)
    sortbyStock: number,
    @Query('sortbyPrice', new DefaultValuePipe(0), ParseIntPipe)
    sortbyPrice: number,
  ) {
    try {
      const param = new RequestPageParam();
      param.page = page;
      param.pageSize = pageSize;
      param.basicFilter = basicFilter;
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
  @Get(':id')
  async GetBooksById(@Param('id') id: string) {
    try {
      const res = await this._book.getBookById(id);
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

  @Put(':id')
  async updateBook(
    @Param('id') id: string,
    @Body(new CustomValidationPipe()) req: CreateBookDto,
  ) {
    try {
      await this._book.updateBook(id, req);
      return this._responseMessage.Ok();
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Delete(':id')
  async deleteBook(@Param('id') id: string) {
    try {
      await this._book.deleteBook(id);
      return this._responseMessage.Ok();
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}

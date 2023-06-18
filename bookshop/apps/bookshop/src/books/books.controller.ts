import { HttpResponseMessage } from '@app/common';
import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RequestPageParam } from 'models/pagination-model/request-pagination';
import { BooksService } from './books.service';
import { CreateBookDto } from 'models/book-model/book-create-model.dto';
import { CustomValidationPipe } from 'pipes/custom-validation.pipe';
import { Request } from '@nestjs/common';
import { AuthGuard } from '@app/common/helps/auth.guard';
import { Roles } from '@app/common/helps/roles.decorator';
import { UserRole } from '@app/common/helps/role.enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
@Controller('api/books')
export class BooksController {
  constructor(
    private readonly _book: BooksService,
    private readonly _responseMessage: HttpResponseMessage,
    @Inject(CACHE_MANAGER) private _cacheManager: Cache,
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
  @UseGuards(AuthGuard)
  @Roles(UserRole.Admin)
  @Post()
  async createBook(@Body(new CustomValidationPipe()) req: CreateBookDto) {
    try {
      const res = await this._book.createBook(req);
      return this._responseMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @UseGuards(AuthGuard)
  @Roles(UserRole.Admin)
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
  @UseGuards(AuthGuard)
  @Roles(UserRole.Admin)
  @Delete(':id')
  async deleteBook(@Param('id') id: string) {
    try {
      await this._book.deleteBook(id);
      return this._responseMessage.Ok();
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @UseGuards(AuthGuard)
  // @Get(':bookId/buy')
  @Get('me/owners')
  async ownerBook(
    @Request() req: any,
    @Query('pageSize', new DefaultValuePipe(15), ParseIntPipe) pageSize: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('basicFilter', new DefaultValuePipe('')) basicFilter: string,
  ) {
    try {
      const param = new RequestPageParam();
      param.page = page;
      param.pageSize = pageSize;
      param.basicFilter = basicFilter;
      const data = await this._book.ownerBook(req.user.id, param);
      return this._responseMessage.Ok(data);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @UseGuards(AuthGuard)
  @Post(':bookId/buy')
  async userBuyBook(@Request() req: any, @Param('bookId') bookId: string) {
    try {
      await this._book.userBuyBook(req.user.id, bookId);
      return this._responseMessage.Ok();
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}

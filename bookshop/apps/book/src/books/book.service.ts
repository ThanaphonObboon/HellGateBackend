import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RequestPageParam } from 'models/pagination-model/request-pagination';
import { Model } from 'mongoose';
import { Book } from 'schema/book.schema';

@Injectable()
export class BookService {
  constructor(@InjectModel(Book.name) private _book: Model<Book>) {}
  getBooks(param: RequestPageParam): string {
    return 'Hello World!';
  }
}

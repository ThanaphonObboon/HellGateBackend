import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'schema/user.schema';
import { JwtAuthenService } from '@app/common/helps/jwt-authen.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { BookController } from './books/book.controller';
import { BookService } from './books/book.service';
import { Book, BookSchema } from 'schema/book.schema';
import { Category, CategorySchema } from 'schema/category.schema';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesService } from './categories/categories.service';
// import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Book.name, schema: BookSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
    JwtModule.register({ global: true }),
  ],
  controllers: [BookController, CategoriesController],
  providers: [BookService, JwtAuthenService, CategoriesService],
})
export class AppModule {}

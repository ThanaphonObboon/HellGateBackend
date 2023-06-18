import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'schema/user.schema';
import { JwtAuthenService } from '@app/common/helps/jwt-authen.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BookController } from './books/book.controller';
import { BookService } from './books/book.service';
import { Book, BookSchema } from 'schema/book.schema';
import { Category, CategorySchema } from 'schema/category.schema';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesService } from './categories/categories.service';
import { helperService } from '@app/common/helps/helper.service';
// import { CacheModule } from '@nestjs/cache-manager';
import { InventoriesController } from './inventories/inventories.controller';
import { InventoriesService } from './inventories/inventories.service';
import { StockHistory, StockHistorySchema } from 'schema/stock-history.schema';
import { SalesHistory, SalesHistorySchema } from 'schema/sales-history';
import { UserBook, UserBookSchema } from 'schema/user-book';
import { ReportsController } from './reports/reports.controller';
import { ReportsService } from './reports/reports.service';
import * as moment from 'moment-timezone';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/book/.env',
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Book.name, schema: BookSchema },
      { name: Category.name, schema: CategorySchema },
      { name: StockHistory.name, schema: StockHistorySchema },
      { name: SalesHistory.name, schema: SalesHistorySchema },
      { name: UserBook.name, schema: UserBookSchema },
    ]),
    JwtModule.register({ global: true }),
    CacheModule.registerAsync<any>({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
      }),
      inject: [ConfigService],
      isGlobal: true,
    }),
  ],
  controllers: [
    BookController,
    CategoriesController,
    InventoriesController,
    ReportsController,
  ],
  providers: [
    BookService,
    JwtAuthenService,
    CategoriesService,
    helperService,
    InventoriesService,
    ReportsService,
  ],
})
export class AppModule {
  constructor() {
    // กำหนดเวลาเริ่มต้นที่ต้องการ (ตัวอย่างเป็น Asia/Bangkok)
    moment.tz.setDefault('Asia/Bangkok');
  }
}

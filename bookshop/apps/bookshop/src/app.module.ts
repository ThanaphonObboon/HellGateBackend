import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HttpResponseMessage } from '@app/common';
import { UserService } from './user/user.service';
import { AppController } from './app/app.controller';
import { AuthenService } from './authen/authen.service';
import { AuthenController } from './authen/authen.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtAuthenService } from '@app/common/helps/jwt-authen.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesService } from './categories/categories.service';
import { helperService } from '@app/common/helps/helper.service';
import { BooksController } from './books/books.controller';
import { BooksService } from './books/books.service';
import { InventoriesController } from './inventories/inventories.controller';
import { InventoriesService } from './inventories/inventories.service';
import { ReportsController } from './reports/reports.controller';
import { ReportsService } from './reports/reports.service';
import * as moment from 'moment-timezone';
// import {  } from '@nestjs/mapped-types';
import { redisStore } from 'cache-manager-redis-store';
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: 'USER_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: { port: configService.get<number>('USER_SERVICE_PORT') },
        }),
        inject: [ConfigService],
      },
      {
        imports: [ConfigModule],
        name: 'BOOK_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: { port: configService.get<number>('BOOK_SERVICE_PORT') },
        }),
        inject: [ConfigService],
      },
    ]),
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
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['./apps/bookshop/.env'],
    }),
    // CacheModule.register({
    //   isGlobal: true,
    // }),
    JwtModule.register({ global: true }),
  ],
  controllers: [
    UserController,
    AppController,
    AuthenController,
    CategoriesController,
    BooksController,
    InventoriesController,
    ReportsController,
  ],
  providers: [
    HttpResponseMessage,
    UserService,
    AuthenService,
    JwtAuthenService,
    CategoriesService,
    helperService,
    BooksService,
    InventoriesService,
    ReportsService,
  ],
})
export class AppModule {
  constructor() {
    moment.tz.setDefault('Asia/Bangkok');
  }
}

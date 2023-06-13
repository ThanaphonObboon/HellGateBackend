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
import { ConfigModule } from '@nestjs/config';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesService } from './categories/categories.service';
import { helperService } from '@app/common/helps/helper.service';
// import type { RedisClientOptions } from 'redis';
import { BooksController } from './books/books.controller';
import { BooksService } from './books/books.service';
// import * as redisStore from 'cache-manager-redis-store';
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: { port: 3002 },
      },
      {
        name: 'BOOK_SERVICE',
        transport: Transport.TCP,
        options: { port: 3001 },
      },
    ]),
    // CacheModule.register<RedisClientOptions>({
    //   store: redisStore,

    //   // Store-specific configuration:
    //   // host: 'localhost',
    //   // port: 8082,
    // }),
    CacheModule.register({
      isGlobal: true,
    }),
    JwtModule.register({ global: true }),
    ConfigModule.forRoot(),
  ],
  controllers: [
    UserController,
    AppController,
    AuthenController,
    CategoriesController,
    BooksController,
  ],
  providers: [
    HttpResponseMessage,
    UserService,
    AuthenService,
    JwtAuthenService,
    CategoriesService,
    helperService,
    BooksService,
  ],
})
export class AppModule {}

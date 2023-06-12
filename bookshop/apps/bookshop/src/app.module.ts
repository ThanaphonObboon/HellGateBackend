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
    CacheModule.register({
      isGlobal: true,
    }),
    JwtModule.register({ global: true }),
    ConfigModule.forRoot(),
  ],
  controllers: [UserController, AppController, AuthenController],
  providers: [
    HttpResponseMessage,
    UserService,
    AuthenService,
    JwtAuthenService,
  ],
})
export class AppModule {}

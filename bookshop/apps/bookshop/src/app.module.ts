import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HttpResponseMessage } from '@app/common';
import { UserService } from './user/user.service';
import { AppController } from './app/app.controller';
import { AuthenService } from './authen/authen.service';
import { AuthenController } from './authen/authen.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ClientsModule.register([
      { name: 'USER', transport: Transport.TCP, options: { port: 3002 } },
    ]),
    CacheModule.register({
      isGlobal: true,
    }),
  ],
  controllers: [UserController, AppController, AuthenController],
  providers: [HttpResponseMessage, UserService, AuthenService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'schema/user.schema';
import { AuthenController } from './authen/authen.controller';
import { AuthenService } from './authen/authen.service';
import { UserController } from './users/user.controller';
import { UserService } from './users/user.service';
import { JwtAuthenService } from '@app/common/helps/jwt-authen.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as moment from 'moment-timezone';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
// import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/user/.env',
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
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
  controllers: [UserController, AuthenController],
  providers: [UserService, AuthenService, JwtAuthenService],
})
export class AppModule {
  constructor() {
    // กำหนดเวลาเริ่มต้นที่ต้องการ (ตัวอย่างเป็น Asia/Bangkok)
    moment.tz.setDefault('Asia/Bangkok');
  }
}

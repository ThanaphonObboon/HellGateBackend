import { Module } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { AppController } from 'src/controllers/app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:8081/bookshop'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

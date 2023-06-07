import { Module } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { AppController } from 'src/controllers/app.controller';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UserModelDto } from 'models/user-model.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<UserModelDto[]> {
    console.log('getHello');
    return await this.appService.getUserLists();
  }
}

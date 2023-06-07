import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserModel } from 'src/models/create-user-model';
import { AppService } from 'src/services/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): object {
    return this.appService.getHello();
  }
  @Post()
  async addUser(@Body() req: CreateUserModel): Promise<string> {
    return await this.appService.createItem(req);
  }
}

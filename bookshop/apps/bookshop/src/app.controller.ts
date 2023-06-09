import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { UserModelDto } from 'models/user-model/user-model.dto';
import { CreateUserModelDto } from 'models/user-model/create-user-model.dto';


@Controller("api/users")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getUserLists(): Promise<UserModelDto[]> {
    return await this.appService.getUserLists();
  }
  @Post()
  async createUser(@Body() req: CreateUserModelDto): Promise<UserModelDto> {
    return await this.appService.createUser(req);
  }
}

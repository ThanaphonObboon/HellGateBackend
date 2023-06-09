import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { UserModelDto } from 'models/user-model.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('get-users-lists1')
  async getUserLists(): Promise<UserModelDto[]> {
    console.log('get-users-lists');
    return null;
  }
}

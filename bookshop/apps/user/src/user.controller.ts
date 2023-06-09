import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { UserModelDto } from 'models/user-model.dto';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @EventPattern({ cmd: 'sum' })
  async getUserLists(): Promise<UserModelDto[]> {
    console.log('get-users-lists');
    return null;
  }
}

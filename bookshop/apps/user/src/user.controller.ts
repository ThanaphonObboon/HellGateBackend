import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { UserModelDto } from 'models/user-model/user-model.dto';
import { CreateUserModelDto } from 'models/user-model/create-user-model.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'service.users.get' })
  async getUserLists(): Promise<UserModelDto[]> {
    return await this.userService.getUserLists();
    
  }
  @MessagePattern({ cmd: 'service.users.add' })
  async createUser(@Payload() req: CreateUserModelDto): Promise<UserModelDto> {
    return await this.userService.createUser(req);
    
  }
}

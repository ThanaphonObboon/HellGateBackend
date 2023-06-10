import { Controller, Inject } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { UserModelDto } from 'models/user-model/user-model.dto';
import {
  CreateUserModelDto,
  UpdateUserModelDto,
} from 'models/user-model/create-user-model.dto';
import {
  PagedResult,
  RequestPageParam,
} from 'models/pagination-model/request-pagination';
import { CustomValidationRpcPipe } from 'pipes/custom-validation.pipe';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @MessagePattern({ cmd: 'service.users.get' })
  async getUserLists(
    @Payload()
    param: RequestPageParam = new RequestPageParam(),
  ): Promise<PagedResult<UserModelDto>> {
    return await this.userService.getUserLists(param);
  }
  @MessagePattern({ cmd: 'service.users.add' })
  async createUser(
    @Payload(new CustomValidationRpcPipe())
    payload: {
      role: string;
      body: CreateUserModelDto;
    },
  ): Promise<UserModelDto> {
    try {
      return await this.userService.createUser(payload);
    } catch (e) {
      throw new RpcException(e.message);
    }
  }
  @MessagePattern({ cmd: 'service.users.id' })
  async getUserById(@Payload() payload: { id: string }): Promise<UserModelDto> {
    try {
      return await this.userService.getUserById(payload.id);
    } catch (e) {
      throw new RpcException(e.message);
    }
  }

  @MessagePattern({ cmd: 'service.users.update' })
  async updateUser(
    @Payload(new CustomValidationRpcPipe())
    req: {
      id: string;
      body: UpdateUserModelDto;
    },
  ): Promise<boolean> {
    try {
      await this.userService.updateUser(req.id, req.body);
      return true;
    } catch (e) {
      throw new RpcException(e.message);
    }
  }
  @MessagePattern({ cmd: 'service.users.delete' })
  async deleteUser(@Payload() id: string): Promise<boolean> {
    try {
      await this.userService.deleteUser(id);
      return true;
    } catch (e) {
      throw new RpcException(e.message);
    }
  }
}

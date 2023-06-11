import { Controller, Inject } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { UserModelDto } from 'models/user-model/user-model.dto';
import {
  CreateUserModelDto,
  UpdateUserModelDto,
  UpdateUserPasswordModelDto,
} from 'models/user-model/create-user-model.dto';
import {
  PagedResult,
  RequestPageParam,
} from 'models/pagination-model/request-pagination';
import { CustomValidationRpcPipe } from 'pipes/custom-validation.pipe';
// import {
//   CacheInterceptor,
//   CacheTTL,
//   CacheKey,
//   CACHE_MANAGER,
// } from '@nestjs/cache-manager';
// import { Cache } from 'cache-manager';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { UseInterceptors } from '@nestjs/common';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  // @UseInterceptors(CacheInterceptor)
  // @CacheKey('all-users')
  @MessagePattern({ cmd: 'service.users.get' })
  async getUserLists(
    @Payload()
    param: RequestPageParam = new RequestPageParam(),
  ): Promise<PagedResult<UserModelDto>> {
    // const userAccounts = await this.cacheManager.get('all-users');
    // if (userAccounts) return userAccounts as PagedResult<UserModelDto>;
    const data = await this.userService.getUserLists(param);
    // this.cacheManager.store.set('all-users', data, 5000);
    return data;
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
  @MessagePattern({ cmd: 'service.users.count.new.member' })
  async countNewMember(): Promise<number> {
    try {
      const res = await this.userService.countNewMember();
      return res;
    } catch (e) {
      throw new RpcException(e.message);
    }
  }
  @MessagePattern({ cmd: 'service.users.count.all.member' })
  async countMember(): Promise<number> {
    try {
      const res = await this.userService.countAllMember();
      return res;
    } catch (e) {
      throw new RpcException(e.message);
    }
  }

  @MessagePattern({ cmd: 'service.users.password.change' })
  async passwordChange(
    @Payload(new CustomValidationRpcPipe())
    payload: {
      id: string;
      req: UpdateUserPasswordModelDto;
    },
  ): Promise<boolean> {
    try {
      await this.userService.passwordChange(payload.id, payload.req);
      return true;
    } catch (e) {
      throw new RpcException(e.message);
    }
  }
  @MessagePattern({ cmd: 'service.users.set.status' })
  async ChangeStatusUser(
    @Payload() payload: { id: string; status: string },
  ): Promise<boolean> {
    try {
      await this.userService.ChangeStatusUser(payload.id, payload.status);
      return true;
    } catch (e) {
      throw new RpcException(e.message);
    }
  }
}

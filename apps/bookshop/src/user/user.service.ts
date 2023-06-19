import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  RequestPageParam,
  PagedResult,
} from 'models/pagination-model/request-pagination';
import {
  CreateUserModelDto,
  UpdateUserModelDto,
  UpdateUserPasswordModelDto,
} from 'models/user-model/create-user-model.dto';
import { UserModelDto } from 'models/user-model/user-model.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(@Inject('USER_SERVICE') private client: ClientProxy) {}

  async getUserLists(
    param: RequestPageParam = new RequestPageParam(),
  ): Promise<PagedResult<UserModelDto>> {
    const result = this.client.send<PagedResult<UserModelDto>>(
      { cmd: 'service.users.get' },
      param,
    );
    return await lastValueFrom(result);
  }
  async getUserById(id: string): Promise<UserModelDto> {
    const result = this.client.send<UserModelDto>(
      { cmd: 'service.users.id' },
      { id },
    );
    return await lastValueFrom(result);
  }

  async createUser(req: {
    role: string;
    body: CreateUserModelDto;
  }): Promise<UserModelDto> {
    const user = await this.client.send<UserModelDto>(
      { cmd: 'service.users.add' },
      req,
    );
    return await lastValueFrom(user);
  }
  async updateUser(id: string, body: UpdateUserModelDto): Promise<void> {
    const result = await this.client.send<boolean>(
      { cmd: 'service.users.update' },
      { id, body },
    );
    await lastValueFrom(result);
  }
  async countNewMember(): Promise<number> {
    const result = await this.client.send<number>(
      { cmd: 'service.users.count.new.member' },
      {},
    );
    return await lastValueFrom(result);
  }

  async countAllUser(): Promise<number> {
    const result = await this.client.send<number>(
      { cmd: 'service.users.count.all.member' },
      {},
    );
    return await lastValueFrom(result);
  }
  async passwordChange(
    id: string,
    req: UpdateUserPasswordModelDto,
  ): Promise<void> {
    const result = await this.client.send<boolean>(
      { cmd: 'service.users.password.change' },
      { id, req },
    );
    await lastValueFrom(result);
  }
  async ChangeStatusUser(id: string, status: string): Promise<void> {
    const result = await this.client.send<boolean>(
      { cmd: 'service.users.set.status' },
      { id, status },
    );
    await lastValueFrom(result);
  }
}

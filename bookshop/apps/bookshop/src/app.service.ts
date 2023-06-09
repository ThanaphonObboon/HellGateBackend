import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { CreateUserModelDto } from 'models/user-model/create-user-model.dto';
import { UserModelDto } from 'models/user-model/user-model.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(@Inject('USER') private client: ClientProxy) {}
  async getUserLists(): Promise<UserModelDto[]> {
    const result = await this.client.send<UserModelDto[]>({ cmd: 'service.users.get' }, {});
    return await lastValueFrom(result);
  }
  async createUser(req: CreateUserModelDto): Promise<UserModelDto> { 
    console.log(req);
    const user = await this.client.send<UserModelDto>({ cmd: 'service.users.add' }, req);
    return await lastValueFrom(user);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { UserModelDto } from 'models/user-model.dto';
import { lastValueFrom } from 'rxjs';
import { User } from 'schema/user.schema';

@Injectable()
export class AppService {
  constructor(@Inject('USER') private client: ClientProxy) {}
  async getUserLists(): Promise<UserModelDto[]> {
    const result = await this.client.send<UserModelDto[]>({ cmd: 'sum' }, {});
    return await lastValueFrom(result);
  }
}

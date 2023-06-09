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
    console.log('----------------------------1');
    const result = await this.client.send({ cmd: 'sum' }, {});
    const final = await lastValueFrom(result);
    // return final;
    console.log('----------------------------2');
    // return plainToInstance(UserModelDto, data);
    return null;
  }
}

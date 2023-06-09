import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { UserModelDto } from 'models/user-model.dto';
import { User } from 'schema/user.schema';

@Injectable()
export class AppService {
  constructor(@Inject('USER') private client: ClientProxy) {}
  async getUserLists(): Promise<UserModelDto[]> {
    console.log('----------------------------1');
    const data = await this.client.send('get-users-lists', {}).toPromise();
    console.log('----------------------------2');
    // return plainToInstance(UserModelDto, data);
    return null;
  }
}

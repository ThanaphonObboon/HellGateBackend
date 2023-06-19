import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthenUserModelDto } from 'models/user-model/authen-user-model.dto';
import { LoginModel } from 'models/user-model/login-user-model.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthenService {
  constructor(@Inject('USER_SERVICE') private client: ClientProxy) {}
  async login(body: LoginModel): Promise<AuthenUserModelDto> {
    const result = this.client.send<AuthenUserModelDto>(
      { cmd: 'service.authen.signin' },
      body,
    );
    return await lastValueFrom(result);
  }
  // async logout(): Promise<void> {}
  // async refreshToken(): Promise<void> {}
}

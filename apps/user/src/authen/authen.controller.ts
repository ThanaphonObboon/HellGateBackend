import { Controller } from '@nestjs/common';
import { AuthenService } from './authen.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CustomValidationRpcPipe } from 'pipes/custom-validation.pipe';
import { LoginModel } from 'models/user-model/login-user-model.dto';
import { AuthenUserModelDto } from 'models/user-model/authen-user-model.dto';
import { JwtAuthenService } from '@app/common/helps/jwt-authen.service';
import { User } from 'schema/user.schema';

@Controller()
export class AuthenController {
  constructor(
    private readonly authenService: AuthenService,
    private readonly jwtAuthenService: JwtAuthenService,
  ) {}

  @MessagePattern({ cmd: 'service.authen.signin' })
  async login(
    @Payload(new CustomValidationRpcPipe()) payload: LoginModel,
  ): Promise<AuthenUserModelDto> {
    try {
      const result = await this.authenService.login(payload);
      const model = new AuthenUserModelDto();
      model.account = result;
      model.token = await this.jwtAuthenService.generateJwtToken(
        result._id.toString(),
        result.role,
      );
      return model;
    } catch (e) {
      throw new RpcException(e.message);
    }
  }
}

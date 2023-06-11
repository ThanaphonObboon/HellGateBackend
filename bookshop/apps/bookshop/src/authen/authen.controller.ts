import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CustomValidationPipe } from 'pipes/custom-validation.pipe';
import { AuthenService } from './authen.service';
import { HttpResponseMessage } from '@app/common';
import { CreateUserModelDto } from 'models/user-model/create-user-model.dto';
import { UserService } from '../user/user.service';
import { JwtAuthenService } from '@app/common/helps/jwt-authen.service';
import { Request } from '@nestjs/common';
import { AuthGuard } from '@app/common/helps/auth.guard';
import { LoginModel } from 'models/user-model/login-user-model.dto';

@Controller('api/authen')
export class AuthenController {
  constructor(
    private readonly _authenService: AuthenService,
    private readonly _userService: UserService,
    private readonly _responseMessage: HttpResponseMessage,
    private readonly _jwtAuthenService: JwtAuthenService,
  ) {}
  @Post('signin')
  async login(@Body(new CustomValidationPipe()) body: LoginModel) {
    try {
      const result = await this._authenService.login(body);
      return this._responseMessage.Ok(result);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @UseGuards(AuthGuard)
  @Get('me')
  async GetMe(@Request() req: any) {
    try {
      console.log(req.user);
      const result = await this._userService.getUserById(req.user.id);
      return this._responseMessage.Ok(result);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Post('signup')
  async signup(@Body(new CustomValidationPipe()) req: CreateUserModelDto) {
    try {
      const res = await this._userService.createUser({
        role: 'member',
        body: req,
      });
      return this._responseMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  // @Post('logout')
  // async logout(@Body() req: CreateUserModelDto) {
  //   try {
  //     return this._responseMessage.Ok();
  //   } catch (e) {
  //     throw new BadRequestException(e.message);
  //   }
  // }
  // @Post('refresh-token')
  // async refreshToken(@Body() req: { token: string }) {
  //   try {
  //     return this._responseMessage.Ok(
  //       await this._jwtAuthenService.decodeJwtToken(req.token),
  //     );
  //   } catch (e) {
  //     throw new BadRequestException(e.message);
  //   }
  // }
}

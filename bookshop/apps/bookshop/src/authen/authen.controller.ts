import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CustomValidationPipe } from 'pipes/custom-validation.pipe';
import { AuthenService } from './authen.service';
import { HttpResponseMessage } from '@app/common';

@Controller('api/authen')
export class AuthenController {
  constructor(
    private readonly authenService: AuthenService,
    private readonly _responseMessage: HttpResponseMessage,
  ) {}
  @Post('login')
  async login(@Body(new CustomValidationPipe()) body) {
    try {
      const result = await this.authenService.login(body);
      return this._responseMessage.Ok(result);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}

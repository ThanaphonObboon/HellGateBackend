import { HttpResponseMessage } from '@app/common';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { RequestPageParam } from 'models/pagination-model/request-pagination';
import {
  CreateUserModelDto,
  UpdateUserModelDto,
} from 'models/user-model/create-user-model.dto';
import { UserService } from './user.service';
import { CustomValidationPipe } from 'pipes/custom-validation.pipe';

@Controller('api/users')
export class UserController {
  constructor(
    private readonly appService: UserService,
    private readonly _responseMessage: HttpResponseMessage,
  ) {}

  @Get()
  async getUserLists(
    @Query() param: RequestPageParam = new RequestPageParam(),
  ) {
    try {
      const res = await this.appService.getUserLists(param);
      return this._responseMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    try {
      const res = await this.appService.getUserById(id);
      return this._responseMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Post('register')
  async createUser(@Body() req: CreateUserModelDto) {
    try {
      const res = await this.appService.createUser({
        role: 'member',
        body: req,
      });
      return this._responseMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Post('')
  async createUserBo(
    @Body(new CustomValidationPipe()) req: CreateUserModelDto,
  ) {
    try {
      const res = await this.appService.createUser({
        role: req.role,
        body: req,
      });
      return this._responseMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body(new CustomValidationPipe()) req: UpdateUserModelDto,
  ) {
    try {
      const res = await this.appService.updateUser(id, req);
      return this._responseMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    try {
      const res = await this.appService.deleteUser(id);
      return this._responseMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}

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
  UseGuards,
  Request,
} from '@nestjs/common';
import { RequestPageParam } from 'models/pagination-model/request-pagination';
import {
  CreateUserModelDto,
  UpdateUserModelDto,
  UpdateUserPasswordModelDto,
} from 'models/user-model/create-user-model.dto';
import { UserService } from './user.service';
import { CustomValidationPipe } from 'pipes/custom-validation.pipe';
import { AuthGuard } from '../../../../libs/common/src/helps/auth.guard';
import { Roles } from '@app/common/helps/roles.decorator';
import { UserRole } from '@app/common/helps/role.enum';

@UseGuards(AuthGuard)
@Controller('api/users')
export class UserController {
  constructor(
    private readonly _userService: UserService,
    private readonly _responseMessage: HttpResponseMessage,
  ) {}
  @Roles(UserRole.Admin)
  @Get('count-new-member')
  async countNewMember(@Request() req: any) {
    try {
      console.log(req.user);
      const res = await this._userService.countNewMember();
      return this._responseMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Roles(UserRole.Admin)
  @Get('count-all-member')
  async countAllUser() {
    try {
      const res = await this._userService.countAllUser();
      return this._responseMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Roles(UserRole.Admin)
  @Get()
  async getUserLists(
    @Query() param: RequestPageParam = new RequestPageParam(),
  ) {
    try {
      const res = await this._userService.getUserLists(param);
      return this._responseMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Roles(UserRole.Admin)
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    try {
      const res = await this._userService.getUserById(id);
      return this._responseMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Roles(UserRole.Admin)
  @Post()
  async createUserBo(
    @Body(new CustomValidationPipe()) req: CreateUserModelDto,
  ) {
    try {
      const res = await this._userService.createUser({
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
      const res = await this._userService.updateUser(id, req);
      return this._responseMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Roles(UserRole.Admin)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    try {
      const res = await this._userService.ChangeStatusUser(id, 'R');
      return this._responseMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Put('me/change/password')
  async passwordChange(
    @Request() req: any,
    @Body(new CustomValidationPipe()) body: UpdateUserPasswordModelDto,
  ) {
    try {
      const res = await this._userService.passwordChange(req.user.id, body);
      return this._responseMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Roles(UserRole.Admin)
  @Post(':id/block')
  async blockUser(@Request() req: any, @Param('id') id: string) {
    try {
      if (req.user.id == id) throw new Error('ไม่สามารถบล็อกตัวเองได้');
      const res = await this._userService.ChangeStatusUser(id, 'B');
      return this._responseMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Roles(UserRole.Admin)
  @Post(':id/active')
  async unblock(@Request() req: any, @Param('id') id: string) {
    try {
      if (req.user.id == id) throw new Error('ไม่สามารถปลดบล็อกตัวเองได้');
      console.log(req.user.id == id);
      console.log(req.user.id);
      console.log(id);
      const res = await this._userService.ChangeStatusUser(id, 'A');
      return this._responseMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}

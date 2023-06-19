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
  ParseIntPipe,
  DefaultValuePipe,
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
import { ConfigService } from '@nestjs/config';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CategoryDto } from 'models/category-model/category-model.dto';
import { ApiOkResponsePaginated } from '@app/common/helps/api-ok-response-paginated';
import { UserModelDto } from 'models/user-model/user-model.dto';

@ApiBearerAuth()
@ApiTags('users')
@UseGuards(AuthGuard)
@Controller('api/users')
export class UserController {
  constructor(
    private readonly _userService: UserService,
    private readonly _responseMessage: HttpResponseMessage,
  ) {}
  @ApiOkResponse({
    description: 'success',
    type: Number,
  })
  @Roles(UserRole.Admin)
  @Get('count-new-member')
  async countNewMember() {
    try {
      const res = await this._userService.countNewMember();
      return this._responseMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @ApiOkResponse({
    description: 'success',
    type: Number,
  })
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
  @ApiOkResponsePaginated(UserModelDto)
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'basicFilter', required: false, type: String })
  @Roles(UserRole.Admin)
  @Get()
  async getUserLists(
    @Query('pageSize', new DefaultValuePipe(15), ParseIntPipe) pageSize = 15,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('basicFilter', new DefaultValuePipe('')) basicFilter = '',
  ) {
    try {
      const param = new RequestPageParam();
      param.page = page;
      param.pageSize = pageSize;
      param.basicFilter = basicFilter;
      const res = await this._userService.getUserLists(param);
      return this._responseMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @ApiOkResponse({
    description: 'success',
    type: UserModelDto,
  })
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
  @ApiOkResponse({
    description: 'success',
    type: UserModelDto,
  })
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
  @ApiOkResponse({
    description: 'success',
    type: String,
  })
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
  @ApiOkResponse({
    description: 'success',
    type: String,
  })
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
  @ApiOkResponse({
    description: 'success',
    type: String,
  })
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
  @ApiOkResponse({
    description: 'success',
    type: String,
  })
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
  @ApiOkResponse({
    description: 'success',
    type: String,
  })
  @Roles(UserRole.Admin)
  @Post(':id/active')
  async unblock(@Request() req: any, @Param('id') id: string) {
    try {
      if (req.user.id == id) throw new Error('ไม่สามารถปลดบล็อกตัวเองได้');
      const res = await this._userService.ChangeStatusUser(id, 'A');
      return this._responseMessage.Ok(res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}

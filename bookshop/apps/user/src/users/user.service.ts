import { Injectable } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import {
  PagedResult,
  RequestPageParam,
} from 'models/pagination-model/request-pagination';
import {
  CreateUserModelDto,
  UpdateUserModelDto,
} from 'models/user-model/create-user-model.dto';
import { UserModelDto } from 'models/user-model/user-model.dto';
import { Model, Types } from 'mongoose';
import { CustomValidationPipe } from 'pipes/custom-validation.pipe';
import { User } from 'schema/user.schema';
import { generate } from 'password-hash';
import { resolve } from 'path';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private _userModel: Model<User>) {}
  async getUserLists(
    param: RequestPageParam,
  ): Promise<PagedResult<UserModelDto>> {
    const options = {
      status: {
        $ne: 'D',
      },
    };
    // await new Promise((resolve, _) => {
    //   setTimeout(() => resolve(true), 3000);
    // });
    param.page = Number(param.page) || 1;
    param.pageSize = Number(param.pageSize) || 15;
    param.page = param.page <= 0 ? 1 : param.page;
    param.pageSize =
      param.pageSize <= 0 || param.pageSize > 1000 ? 15 : param.pageSize;
    const page = new PagedResult<UserModelDto>();
    // const query = this._userModel.find(options);
    page.totalItems = await this._userModel.countDocuments(options).exec();
    page.thisPages = param.page;
    page.pageSizes = param.pageSize;
    page.totalPages = Math.ceil(
      Number(page.totalItems) / Number(page.pageSizes),
    );
    const skip = (page.thisPages - 1) * page.pageSizes;
    const items = await this._userModel
      .find(options)
      .lean()
      .skip(skip)
      .limit(page.pageSizes)
      .exec();
    page.items = [];
    items.forEach((item) => {
      const model = new UserModelDto();
      model._id = item._id;
      model.bookOwnerCount = item.bookOwnerCount;
      model.firstName = item.firstName;
      model.lastName = item.lastName;
      model.fullName = item.fullName;
      model.username = item.username;
      model.password = undefined;
      model.status = item.status;
      model.creeatedAt = item.creeatedAt;
      model.updatedAt = item.updatedAt;
      model.role = item.role;
      page.items.push(model);
    });
    return page;
  }
  async createUser(
    @Payload(new CustomValidationPipe())
    payload: {
      role: string;
      body: CreateUserModelDto;
    },
  ): Promise<UserModelDto> {
    const account = await this._userModel
      .findOne({
        username: payload.body.username,
        status: {
          $ne: 'D',
        },
      })
      .lean()
      .exec();
    if (account) throw new Error('ชื่อผู้ใช้งานนี้มีอยู่ในระบบแล้ว');
    const createdDocument = new this._userModel({
      username: payload.body.username,
      password: generate(payload.body.password),
      firstName: payload.body.firstName,
      lastName: payload.body.lastName,
      fullName: payload.body.firstName + ' ' + payload.body.lastName,
      creeatedAt: new Date(),
      bookOwnerCount: 0,
      role: payload.role,
      status: 'A',
    });
    const user = await createdDocument.save();
    const userModel = user as UserModelDto;
    userModel.password = undefined;
    return userModel;
  }
  async getUserById(id: string): Promise<UserModelDto> {
    if (!Types.ObjectId.isValid(id))
      throw new Error('รูปแบบของรหัสผู้ใช้งานไม่ถูกต้อง');
    const account: User = await this._userModel
      .findOne({
        _id: new Types.ObjectId(id),
        status: {
          $ne: 'D',
        },
      })
      .lean()
      .exec();
    if (!account) throw new Error('ไม่พบข้อมูลผู้ใช้งาน');
    const data = account as UserModelDto;
    data.password = undefined;
    return data;
  }
  async updateUser(id: string, req: UpdateUserModelDto): Promise<void> {
    if (!Types.ObjectId.isValid(id))
      throw new Error('รูปแบบของรหัสผู้ใช้งานไม่ถูกต้อง');
    const query = { _id: new Types.ObjectId(id) };
    const update = {
      fullName: req.firstName + ' ' + req.lastName,
      firstName: req.firstName,
      lastName: req.lastName,
      updatedAt: new Date(),
    };
    const updatedUser = await this._userModel.findOneAndUpdate(query, update, {
      new: true,
    });
    if (!updatedUser) throw new Error('ไม่พบข้อมูลผู้ใช้งาน');
  }
  async deleteUser(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id))
      throw new Error('รูปแบบของรหัสผู้ใช้งานไม่ถูกต้อง');
    const query = {
      _id: new Types.ObjectId(id),
      status: {
        $ne: 'D',
      },
    };
    const update = {
      status: 'D',
      updatedAt: new Date(),
    };
    const updatedUser = await this._userModel.findOneAndUpdate(query, update, {
      new: true,
    });
    if (!updatedUser) throw new Error('ไม่พบข้อมูลผู้ใช้งาน');
  }
}

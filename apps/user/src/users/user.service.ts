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
  UpdateUserPasswordModelDto,
} from 'models/user-model/create-user-model.dto';
import { UserModelDto } from 'models/user-model/user-model.dto';
import { Model, Types } from 'mongoose';
import { CustomValidationPipe } from 'pipes/custom-validation.pipe';
import { User } from 'schema/user.schema';
import { generate } from 'password-hash';
import { resolve } from 'path';
import { verify } from 'password-hash';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private _userModel: Model<User>) {}
  async getUserLists(
    param: RequestPageParam,
  ): Promise<PagedResult<UserModelDto>> {
    let options: any = {};
    options = {
      status: {
        $ne: 'D',
      },
    };
    if (param.basicFilter) {
      options.$or = [
        { username: new RegExp(param.basicFilter.toString().trim(), 'i') },
        { fullName: new RegExp(param.basicFilter.toString().trim(), 'i') },
      ];
    }
    // await new Promise((resolve, _) => {
    //   setTimeout(() => resolve(true), 2000);
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
        username: {
          $regex: new RegExp('^' + payload.body.username + '$', 'i'),
        },
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
    return data;
  }
  async updateUser(id: string, req: UpdateUserModelDto): Promise<void> {
    if (!Types.ObjectId.isValid(id))
      throw new Error('รูปแบบของรหัสผู้ใช้งานไม่ถูกต้อง');
    const query = { _id: new Types.ObjectId(id) };
    const account = await this._userModel.findOne(query).exec();
    if (!account) throw new Error('ไม่พบข้อมูลผู้ใช้งาน');
    account.firstName = req.firstName;
    account.lastName = req.lastName;
    account.fullName = account.firstName + '' + account.lastName;
    account.updatedAt = new Date();
    account.save();
  }
  async countNewMember(): Promise<number> {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    const count = await this._userModel
      .countDocuments({
        status: 'A',
        role: 'member',
        creeatedAt: { $gte: date },
      })
      .exec();
    return count;
  }
  async countAllMember(): Promise<number> {
    const count = await this._userModel
      .countDocuments({
        status: 'A',
        role: 'member',
      })
      .exec();
    return count;
  }
  async passwordChange(
    id: string,
    req: UpdateUserPasswordModelDto,
  ): Promise<void> {
    if (!Types.ObjectId.isValid(id))
      throw new Error('รูปแบบของรหัสผู้ใช้งานไม่ถูกต้อง');
    const query = { _id: new Types.ObjectId(id) };
    const account = await this._userModel.findOne(query).exec();
    if (!account) throw new Error('ไม่พบข้อมูลผู้ใช้งาน');
    if (!verify(req.currentPassword, account.password))
      throw new Error('รหัสผ่านเดิมไม่ถูกต้อง');
    account.password = generate(req.newPassword);
    account.creeatedAt = new Date();
    await account.save();
  }

  async ChangeStatusUser(id: string, status: string): Promise<void> {
    if (!Types.ObjectId.isValid(id))
      throw new Error('รูปแบบของรหัสผู้ใช้งานไม่ถูกต้อง');
    const query = { _id: new Types.ObjectId(id) };
    const account = await this._userModel.findOne(query).exec();
    if (!account) throw new Error('ไม่พบข้อมูลผู้ใช้งาน');
    account.status = status;
    account.creeatedAt = new Date();
    await account.save();
  }
}

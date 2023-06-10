import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { verify } from 'password-hash';
import { LoginModel } from 'models/user-model/login-user-model.dto';
import { Model } from 'mongoose';
import { User } from 'schema/user.schema';
import { UserModelDto } from 'models/user-model/user-model.dto';

@Injectable()
export class AuthenService {
  constructor(@InjectModel(User.name) private _userModel: Model<User>) {}
  async login(payload: LoginModel): Promise<UserModelDto> {
    const account = await this._userModel.findOne({
      username: payload.username,
      status: 'A',
    });
    if (!account || !verify(payload.password, account.password))
      throw new Error('ชื่อผู้ใช้งาน หรือ รหัสผ่าน ไม่ถูกต้อง');

    return account as UserModelDto;
    // if (!user) {
    //   return {
    //     status: 404,
    //     message: 'User not found',
    //   };
    // }
    // if (user.password !== payload.password) {
    //   return {
    //     status: 400,
    //     message: 'Password incorrect',
    //   };
    // }
    // return {
    //   status: 200,
    //   message: 'Login success',
    //   data: user,
    // };
  }
}

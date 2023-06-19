import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { verify } from 'password-hash';
import { LoginModel } from 'models/user-model/login-user-model.dto';
import { Model } from 'mongoose';
import { User } from 'schema/user.schema';
import { UserModelDto } from 'models/user-model/user-model.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { LoginLockedModel } from 'models/authen-model/authen-loginLocked.model';
@Injectable()
export class AuthenService {
  constructor(
    @InjectModel(User.name) private _userModel: Model<User>,
    @Inject(CACHE_MANAGER) private _cacheManager: Cache,
  ) {}
  async login(payload: LoginModel): Promise<UserModelDto> {
    if (await this.checkLoginLocked(payload.username))
      throw new Error('ล็อคอินผิดพลาด 3 ครั้งแล้วคุณถูกระงับ 10 วินาที');
    const account = await this._userModel.findOne({
      username: { $regex: new RegExp('^' + payload.username + '$', 'i') },
      status: 'A',
    });
    if (!account || !verify(payload.password, account.password)) {
      await this.setLoginfailed(payload.username);
      throw new Error('ชื่อผู้ใช้งาน หรือ รหัสผ่าน ไม่ถูกต้อง');
    }
    const accountdto = account as UserModelDto;
    await this.removeLocked(payload.username);
    return accountdto;
  }
  async checkLoginLocked(username: string): Promise<boolean> {
    const blockLists: LoginLockedModel[] =
      (await this._cacheManager.get('loginLocked')) ?? [];
    const user = blockLists.find(
      (x) =>
        x.username == username && new Date(x.loginLockedExpAt) > new Date(),
    );
    if (user) return true;
    blockLists
      .filter(
        (x) =>
          x.username == username && new Date(x.loginLockedExpAt) < new Date(),
      )
      .forEach((x) => {
        const index = blockLists.indexOf(x);
        if (index !== -1) {
          blockLists.splice(index, 1);
        }
      });
    return false;
  }
  async setLoginfailed(username: string): Promise<void> {
    const blockLists: LoginLockedModel[] =
      (await this._cacheManager.get('loginLocked')) ?? [];
    const user = blockLists.find((x) => x.username == username);
    if (!user) {
      const newuser = new LoginLockedModel();
      newuser.username = username;
      newuser.loginFailedCount = 1;
      blockLists.push(newuser);
      await this._cacheManager.set('loginLocked', blockLists);
    } else {
      user.loginFailedCount += 1;
      if (user.loginFailedCount >= 3) {
        const thisDate = new Date();
        thisDate.setSeconds(thisDate.getSeconds() + 10);
        user.loginLockedExpAt = thisDate;
        user.loginFailedCount = 0;
      }
      await this._cacheManager.set('loginLocked', blockLists);
    }
  }
  async removeLocked(username: string): Promise<void> {
    const blockLists: LoginLockedModel[] =
      (await this._cacheManager.get('loginLocked')) ?? [];
    await this._cacheManager.set(
      'loginLocked',
      blockLists.filter((x) => x.username != username),
    );
  }
}

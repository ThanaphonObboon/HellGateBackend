import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class helperService {
  public isEmptyObject(obj: object): boolean {
    return Object.keys(obj).length === 0;
  }
  public toObjectId(id: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(id)) throw new Error('รูปแบบของรหัสไม่ถูกต้อง');
    return new Types.ObjectId(id);
  }
}

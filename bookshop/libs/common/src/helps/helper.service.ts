import { Injectable } from '@nestjs/common';
import { ClassConstructor, plainToClass } from 'class-transformer';
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

  public plainToClass<T>(classType: ClassConstructor<T>, obj: object): T {
    return plainToClass(classType, obj, {
      excludeExtraneousValues: true,
    });
  }
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class helperService {
  public isEmptyObject(obj: object): boolean {
    return Object.keys(obj).length === 0;
  }
}

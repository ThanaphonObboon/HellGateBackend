import { AbstractDocument } from '@app/common';

export class UserModelDto extends AbstractDocument {
  username: string;

  password: string;

  fullname: string;

  bookOwnerCount: number;

  lastPurchaseDate: Date;
}

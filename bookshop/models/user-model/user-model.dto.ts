import { AbstractDocument } from '@app/common';

export class UserModelDto extends AbstractDocument {
  username: string;

  password: string;

  fileName: string;

  bookOwnerCount: number;

  lastPurchaseDate: Date;
}

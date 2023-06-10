import { Types } from 'mongoose';

export class UserModelDto {
  _id: Types.ObjectId;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  fullName: string;
  bookOwnerCount: number;
  lastPurchaseDate: Date;
  creeatedAt: Date;
  updatedAt: Date;
  //A=Active, I=Inactive, D=Deleted
  status: string;
  //admin, member
  role: string;
}

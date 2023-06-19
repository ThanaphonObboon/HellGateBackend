import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class UserModelDto {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;
  @ApiProperty({ type: String })
  username: string;
  @ApiProperty({ type: String })
  firstName: string;
  @ApiProperty({ type: String })
  lastName: string;
  @ApiProperty({ type: String })
  fullName: string;
  @ApiProperty({ type: Number })
  bookOwnerCount: number;
  @ApiProperty({ type: Date })
  lastPurchaseDate: Date;
  @ApiProperty({ type: Date })
  creeatedAt: Date;
  @ApiProperty({ type: Date })
  updatedAt: Date;
  @ApiProperty({ type: String })
  //A=Active, I=Inactive, D=Deleted
  status: string;
  @ApiProperty({ type: String })
  //admin, member
  role: string;
}

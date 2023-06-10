import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'users', versionKey: false })
export class User {
  _id: Types.ObjectId;

  @Prop(String)
  username: string;

  @Prop(String)
  password: string;

  @Prop(String)
  firstName: string;

  @Prop(String)
  lastName: string;

  @Prop(String)
  fullName: string;

  @Prop(Number)
  bookOwnerCount: number;

  @Prop(Date)
  lastPurchaseDate: Date;
  @Prop(Date)
  creeatedAt: Date;
  @Prop(Date)
  updatedAt: Date;
  //A=Active, I=Inactive, D=Deleted
  @Prop(String)
  status: string;
  //admin, member
  @Prop(String)
  role: string;
}
export const UserSchema = SchemaFactory.createForClass(User);

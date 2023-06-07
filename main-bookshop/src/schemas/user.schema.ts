import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'users' })
export class User {
  //   @Prop({ type: SchemaTypes.ObjectId })
  //   _id: Types.ObjectId;
  @Prop(String)
  username: string;

  @Prop(String)
  password: string;

  @Prop(String)
  fullname: string;

  @Prop(Number)
  bookOwnerCount: number;

  @Prop(Date)
  lastPurchaseDate: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

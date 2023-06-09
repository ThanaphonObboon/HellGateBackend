import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'users' , versionKey: false})
export class User extends AbstractDocument {
  //   @Prop({ type: SchemaTypes.ObjectId })
  //   _id: Types.ObjectId;
  @Prop(String)
  username: string;

  @Prop(String)
  password: string;

  @Prop(String)
  fullName: string;

  @Prop(Number)
  bookOwnerCount: number;

  @Prop(Date)
  lastPurchaseDate: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);

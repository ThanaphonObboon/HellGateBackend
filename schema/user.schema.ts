import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'users', versionKey: false })
export class User {
  _id: Types.ObjectId;

  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String })
  firstName: string;

  @Prop({ type: String })
  lastName: string;

  @Prop({ type: String })
  fullName: string;

  @Prop({ type: Number, default: 0 })
  bookOwnerCount: number;

  @Prop({ type: Date })
  lastPurchaseDate: Date;
  @Prop({ type: Date })
  creeatedAt: Date;
  @Prop({ type: Date })
  updatedAt: Date;
  //A=Active, B=Block, D=Deleted
  @Prop({ type: String, default: 'A' })
  status: string;
  //admin, member
  @Prop({ type: String })
  role: string;
}
export const UserSchema = SchemaFactory.createForClass(User);

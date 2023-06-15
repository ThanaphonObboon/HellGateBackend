import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserBookDocument = HydratedDocument<UserBook>;

@Schema({ collection: 'userBooks', versionKey: false })
export class UserBook {
  _id: Types.ObjectId;
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;
  @Prop({ type: Date, default: new Date() })
  buyAt: Date;
  @Prop({ type: Types.ObjectId, required: true })
  bookId: Types.ObjectId;
}
export const UserBookSchema = SchemaFactory.createForClass(UserBook);

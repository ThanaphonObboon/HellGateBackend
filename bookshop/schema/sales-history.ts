import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SalesHistoryDocument = HydratedDocument<SalesHistory>;

@Schema({ collection: 'SalesHistories', versionKey: false })
export class SalesHistory {
  _id: Types.ObjectId;
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;
  @Prop({ type: Date, default: new Date() })
  createdAt: Date;
  @Prop({ type: Types.ObjectId, required: true })
  bookId: Types.ObjectId;
  @Prop({ type: Number, default: 0 })
  price: number;
}
export const SalesHistorySchema = SchemaFactory.createForClass(SalesHistory);

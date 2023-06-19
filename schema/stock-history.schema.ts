import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type StockHistoryDocument = HydratedDocument<StockHistory>;

@Schema({ collection: 'stockHistories', versionKey: false })
export class StockHistory {
  _id: Types.ObjectId;
  @Prop({ type: Number, default: 0 })
  amount: number;
  @Prop({ type: Number, default: 0 })
  //stockเก่า
  oldstock: number;
  @Prop({ type: Number, default: 0 })
  //stockใหม่
  stock: number;
  //S=Sold, A=Adject
  @Prop({ type: String, default: 'A' })
  actionType: string;
  @Prop({ type: Date, default: new Date() })
  createdAt: Date;
  @Prop({ type: Types.ObjectId, required: true })
  bookId: Types.ObjectId;
}
export const StockHistorySchema = SchemaFactory.createForClass(StockHistory);

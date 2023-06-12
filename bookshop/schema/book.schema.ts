import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export interface IStockHistory {
  amount: number;
  oldstock: number;
  stock: number;
  //S=Sold, A=Adject
  actionType: string;
  createdAt: Date;
}
export interface ISaleHistory {
  soldAt: Date;
  saleAccountId: Types.ObjectId;
  price: number;
  fullName: string;
}

export type BookDocument = HydratedDocument<Book>;

@Schema({ collection: 'books', versionKey: false, _id: false })
export class Book {
  @Prop({
    required: true,
    type: Types.ObjectId,
    unique: true,
    default: new Types.ObjectId(),
  })
  bookId: Types.ObjectId;
  //ชื่อผู้เขียน
  @Prop({ type: String })
  author: string;
  @Prop({ type: String, required: true })
  title: string;
  @Prop({ type: String })
  description: string;
  @Prop({ type: String })
  bookType: string;
  @Prop({ type: Number, required: true, default: 0 })
  price: number;
  @Prop({ type: Number, required: true, default: 0 })
  stock: number;
  @Prop({ type: Number, required: true, default: 0 })
  numberOfSales: number;
  @Prop({
    type: [
      {
        soldAt: Date,
        accountId: Types.ObjectId,
        price: Number,
        fullName: String,
      },
    ],
    default: [],
  })
  salesHistories: ISaleHistory[];

  @Prop({
    type: [
      {
        amount: Number,
        oldstock: Number,
        stock: Number,
        //S=Sold, A=Adject
        actionType: String,
        createdAt: Date,
      },
    ],
    default: [],
  })
  stockHistories: IStockHistory[];
  @Prop({ type: Date, default: new Date() })
  creeatedAt: Date;
  @Prop({ type: Date })
  updatedAt: Date;
  @Prop({ type: String, default: 'A', required: true }) //A=Actived, R=Removed
  status: string;
}
export const bookSchema = SchemaFactory.createForClass(Book);

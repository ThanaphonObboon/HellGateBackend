import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Category } from './category.schema';

export interface IStockHistory {
  //แปลี่ยนแปลงจำนวนหนังสือ
  amount: number;
  //stockเก่า
  oldstock: number;
  //stockใหม่
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

@Schema({ collection: 'books', versionKey: false })
export class Book {
  _id: Types.ObjectId;
  //ชื่อผู้เขียน
  @Prop({ type: String, default: '' })
  author: string;
  @Prop({ type: String, required: true, default: '' })
  title: string;
  @Prop({ type: String, default: '' })
  CoverImage: string;
  @Prop({ type: String, default: '' })
  description: string;
  // @Prop({ type: String, default: '' })
  // bookType: string;
  @Prop({ type: Number, default: 0 })
  price: number;
  @Prop({ type: Number, default: 0 })
  stock: number;
  @Prop({ type: Number, default: 0 })
  numberOfSales: number;
  @Prop({ type: Date, default: new Date() })
  creeatedAt: Date;
  @Prop({ type: Date })
  updatedAt: Date;
  @Prop({ type: String, default: 'A' }) //A=Actived, R=Removed
  status: string;
  @Prop({ type: Types.ObjectId })
  categoryId: Types.ObjectId;
  // @Prop({
  //   type: Types.ObjectId,
  // })
  // categoryId: Types.ObjectId;
  // //ชื่อผู้เขียน
  // @Prop({ type: String, required: true })
  // categoryName: string;
}
export const BookSchema = SchemaFactory.createForClass(Book);

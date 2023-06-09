import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Category } from './category.schema';

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
}
export const BookSchema = SchemaFactory.createForClass(Book);

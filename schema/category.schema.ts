import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;
@Schema({ collection: 'categories', versionKey: false })
export class Category {
  _id: Types.ObjectId;
  //ชื่อผู้เขียน
  @Prop({ type: String, required: true })
  categoryName: string;
  @Prop({ type: Date, default: new Date() })
  creeatedAt: Date;
  @Prop({ type: Date })
  updatedAt: Date;
  @Prop({ type: String, default: 'A' }) //A=Actived, R=Removed
  status: string;
  @Prop({ type: Number, default: 0 })
  bookInCategory: number;
}
export const CategorySchema = SchemaFactory.createForClass(Category);

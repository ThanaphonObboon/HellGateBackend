import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ collection: 'categories', versionKey: false, _id: false })
export class Category {
  @Prop({
    required: true,
    type: Types.ObjectId,
    unique: true,
    default: new Types.ObjectId(),
  })
  categoryId: Types.ObjectId;
  //ชื่อผู้เขียน
  @Prop({ type: String, required: true })
  categoryName: string;
  @Prop({ type: Date, default: new Date() })
  creeatedAt: Date;
  @Prop({ type: Date })
  updatedAt: Date;
  @Prop({ type: String, default: 'A', required: true }) //A=Actived, R=Removed
  status: string;
  @Prop({ type: Number, default: 0, required: true }) //A=Actived, R=Removed
  bookInCategory: number;
}
export const CategorySchema = SchemaFactory.createForClass(Category);

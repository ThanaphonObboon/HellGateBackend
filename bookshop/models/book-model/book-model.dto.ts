import { Expose, Transform, TransformFnParams } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { CategoryDto } from 'models/category-model/category-model.dto';
import { Types } from 'mongoose';
import { Category } from 'schema/category.schema';

export class BookDto {
  @Expose()
  @Transform((value: TransformFnParams) => value.obj._id)
  @IsString()
  _id: string;
  @Expose()
  @IsString()
  //ชื่อผู้เขียน
  author: string;
  @Expose()
  @IsString()
  title: string;
  @Expose()
  @IsString()
  description: string;
  // @Expose()
  // @IsString()
  // bookType: string;
  @Expose()
  @IsNumber()
  price: number;
  @Expose()
  @IsNumber()
  stock: number;
  @Expose()
  @IsNumber()
  numberOfSales: number;
  @Expose()
  @Transform((value: TransformFnParams) => value.obj?.categoryId || '')
  @IsString()
  categoryId: string;
  @Expose()
  @Transform(
    (value: TransformFnParams) =>
      value.obj?.category?.find(() => true)?.categoryName || '',
  )
  @IsString()
  categoryName: string;
  //   salesHistories: ISaleHistory[];
  //   stockHistories: IStockHistory[];
  @Expose()
  @IsDate()
  creeatedAt: Date;
  @Expose()
  @IsDate()
  updatedAt: Date;
  @Expose()
  @IsString() //A=Actived, R=Removed
  status: string;
}
export class BookReportDto {
  @Expose()
  @IsString()
  @Transform((value: TransformFnParams) => value?.obj?.bookId || 0)
  bookId: string;
  @Expose()
  @IsString()
  //ชื่อผู้เขียน
  author: string;
  @Expose()
  @IsString()
  title: string;
  @Expose()
  @IsString()
  description: string;
  // @Expose()
  // @IsString()
  // bookType: string;
  // @Expose()
  // @IsNumber()
  // price: number;
  // @Expose()
  // @IsNumber()
  // stock: number;
  @Expose()
  @IsNumber()
  totalSales: number;
  @Expose()
  @IsString()
  @Transform((value: TransformFnParams) => value?.obj?.categoryId || '')
  categoryId: string;
  @Expose()
  @IsString()
  categoryName: string;
}

export class UserBookDto {
  @Expose()
  @Transform((value: TransformFnParams) => value.obj._id)
  @IsString()
  _id: string;
  @Expose()
  @Transform((value: TransformFnParams) => value.obj?.userId || '')
  @IsString()
  userId: string;
  @Expose()
  @IsDate()
  buyAt: Date;
  @Expose()
  @Transform((value: TransformFnParams) => value.obj?.bookId || '')
  @IsString()
  bookId: string;
  @Transform(
    (value: TransformFnParams) =>
      value.obj?.book?.find(() => true)?.author || '',
  )
  @Expose()
  @IsString()
  author: string;
  @Transform(
    (value: TransformFnParams) =>
      value.obj?.book?.find(() => true)?.title || '',
  )
  @Expose()
  @IsString()
  title: string;
  @Transform(
    (value: TransformFnParams) =>
      value.obj?.book?.find(() => true)?.description || '',
  )
  @Expose()
  @IsString()
  description: string;
  @Expose()
  @Transform(
    (value: TransformFnParams) =>
      value.obj?.category?.find(() => true)?._id || '',
  )
  @IsString()
  categoryId: string;
  @Expose()
  @Transform(
    (value: TransformFnParams) =>
      value.obj?.category?.find(() => true)?.categoryName || '',
  )
  @IsString()
  categoryName: string;
}

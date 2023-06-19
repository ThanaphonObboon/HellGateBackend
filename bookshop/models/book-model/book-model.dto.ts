import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, TransformFnParams } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { CategoryDto } from 'models/category-model/category-model.dto';
import { Types } from 'mongoose';
import { Category } from 'schema/category.schema';

export class BookDto {
  @ApiProperty({ type: String })
  @Expose()
  @Transform((value: TransformFnParams) => value.obj._id)
  @IsString()
  _id: string;
  @ApiProperty({ type: String })
  @Expose()
  @IsString()
  //ชื่อผู้เขียน
  author: string;
  @ApiProperty({ type: String })
  @Expose()
  @IsString()
  title: string;
  @Expose()
  @ApiProperty({ type: String })
  @IsString()
  description: string;
  // @Expose()
  // @IsString()
  // bookType: string;
  @ApiProperty({ type: Number })
  @Expose()
  @IsNumber()
  price: number;
  @ApiProperty({ type: Number })
  @Expose()
  @IsNumber()
  stock: number;
  @ApiProperty({ type: Number })
  @Expose()
  @IsNumber()
  numberOfSales: number;
  @ApiProperty({ type: String })
  @Expose()
  @Transform((value: TransformFnParams) => value.obj?.categoryId || '')
  @IsString()
  categoryId: string;
  @Expose()
  @Transform(
    (value: TransformFnParams) =>
      value.obj?.category?.find(() => true)?.categoryName || '',
  )
  @ApiProperty({ type: String })
  @IsString()
  categoryName: string;
  //   salesHistories: ISaleHistory[];
  //   stockHistories: IStockHistory[];
  @Expose()
  @IsDate()
  @ApiProperty({ type: Date })
  creeatedAt: Date;
  @ApiProperty({ type: Date })
  @Expose()
  @IsDate()
  updatedAt: Date;
  @ApiProperty({ type: String })
  @Expose()
  @IsString() //A=Actived, R=Removed
  status: string;
}
export class BookReportDto {
  @Expose()
  @IsString()
  @ApiProperty()
  @Transform((value: TransformFnParams) => value?.obj?.bookId || 0)
  bookId: string;
  @Expose()
  @IsString()
  @ApiProperty()
  //ชื่อผู้เขียน
  author: string;
  @Expose()
  @IsString()
  @ApiProperty()
  title: string;
  @Expose()
  @IsString()
  @ApiProperty()
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
  @ApiProperty()
  totalSales: number;
  @Expose()
  @IsString()
  @ApiProperty()
  @Transform((value: TransformFnParams) => value?.obj?.categoryId || '')
  categoryId: string;
  @Expose()
  @IsString()
  @ApiProperty()
  categoryName: string;
}

export class UserBookDto {
  @Expose()
  @Transform((value: TransformFnParams) => value.obj._id)
  @IsString()
  @ApiProperty()
  _id: string;
  @Expose()
  @Transform((value: TransformFnParams) => value.obj?.userId || '')
  @IsString()
  @ApiProperty()
  userId: string;
  @Expose()
  @IsDate()
  @ApiProperty()
  buyAt: Date;
  @Expose()
  @ApiProperty()
  @Transform((value: TransformFnParams) => value.obj?.bookId || '')
  @IsString()
  @ApiProperty()
  bookId: string;
  @Transform(
    (value: TransformFnParams) =>
      value.obj?.book?.find(() => true)?.author || '',
  )
  @Expose()
  @IsString()
  @ApiProperty()
  author: string;
  @Transform(
    (value: TransformFnParams) =>
      value.obj?.book?.find(() => true)?.title || '',
  )
  @Expose()
  @IsString()
  @ApiProperty()
  title: string;
  @Transform(
    (value: TransformFnParams) =>
      value.obj?.book?.find(() => true)?.description || '',
  )
  @Expose()
  @IsString()
  @ApiProperty()
  description: string;
  @Expose()
  @Transform(
    (value: TransformFnParams) =>
      value.obj?.category?.find(() => true)?._id || '',
  )
  @IsString()
  @ApiProperty()
  categoryId: string;
  @Expose()
  @Transform(
    (value: TransformFnParams) =>
      value.obj?.category?.find(() => true)?.categoryName || '',
  )
  @IsString()
  @ApiProperty()
  categoryName: string;
}

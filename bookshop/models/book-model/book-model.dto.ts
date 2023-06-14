import { Expose, Transform, TransformFnParams } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { CategoryDto } from 'models/category-model/category-model.dto';
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
  @Expose()
  @IsString()
  bookType: string;
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
  @Transform((value: TransformFnParams) => value.obj.categoryId)
  @IsString()
  categoryId: string;
  @Expose()
  @Transform((value: TransformFnParams) => value.obj?.category[0]?.categoryName)
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

import { Expose, Transform, TransformFnParams, Type } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

//หนังสือที่ถูกขายในแต่ละหมวดหมู่
export class ReportSalesCategoryDto {
  @Expose()
  @IsString()
  @Transform((value: TransformFnParams) => value.obj?.categoryId || '')
  categoryId: string;

  @IsString()
  @Expose()
  categoryName: string;

  @Expose()
  @IsNumber()
  @Transform((value: TransformFnParams) => Number(value.obj?.totalSales || 0))
  totalSales: number;
}

export class PostReportSalesCategoryDto {
  @Expose()
  @Type(() => Date)
  // @Transform((value: TransformFnParams) =>
  //   value.value == null ? null : new Date(value.value),
  // )
  startDate?: Date;
  @Expose()
  @Type(() => Date)
  // @Transform((value: TransformFnParams) =>
  //   value.value == null ? null : new Date(value.value),
  // )
  endDate?: Date;
  @Expose()
  @IsNumber()
  @Type(() => Number)
  sort: number;
}

export class ReportUserModelDto {
  @Expose()
  @IsString()
  @Transform((value: TransformFnParams) => Number(value.obj?.userId || 0))
  userId: string;
  @Expose()
  @IsString()
  username: string;
  @Expose()
  @IsString()
  fullName: string;
  @Expose()
  @IsNumber()
  totalBook: number;
  @Expose()
  @IsNumber()
  totlalPrice: number;
  bookCategories: ReportSalesCategoryDto2[];
}
export class ReportSalesCategoryDto2 {
  @Expose()
  @IsString()
  @Transform((value: TransformFnParams) => value.obj?.categoryId || '')
  categoryId: string;

  @IsString()
  @Expose()
  categoryName: string;

  @Expose()
  @IsNumber()
  // @Transform((value: TransformFnParams) => Number(value.obj?.totalSales || 0))
  totalBook: number;

  @Expose()
  @IsNumber()
  totalPrice: number;
}
//หนังสือที่ถูกขาย

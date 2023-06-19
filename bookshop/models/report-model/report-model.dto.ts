import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, TransformFnParams, Type } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

//หนังสือที่ถูกขายในแต่ละหมวดหมู่
export class ReportSalesCategoryDto {
  @Expose()
  @IsString()
  @ApiProperty()
  @Transform((value: TransformFnParams) => value.obj?.categoryId || '')
  categoryId: string;

  @IsString()
  @Expose()
  @ApiProperty()
  categoryName: string;

  @Expose()
  @IsNumber()
  @ApiProperty()
  @Transform((value: TransformFnParams) => Number(value.obj?.totalSales || 0))
  totalSales: number;
}

export class PostReportSalesCategoryDto {
  @Expose()
  @Type(() => Date)
  // @Transform((value: TransformFnParams) =>
  //   value.value == null ? null : new Date(value.value),
  // )
  @ApiProperty()
  startDate?: Date;
  @Expose()
  @Type(() => Date)
  // @Transform((value: TransformFnParams) =>
  //   value.value == null ? null : new Date(value.value),
  // )
  @ApiProperty()
  endDate?: Date;
  @Expose()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty()
  sort: number;
}

export class ReportUserModelDto {
  @Expose()
  @IsString()
  @Transform((value: TransformFnParams) => Number(value.obj?.userId || 0))
  @ApiProperty()
  userId: string;
  @Expose()
  @IsString()
  @ApiProperty()
  username: string;
  @Expose()
  @IsString()
  @ApiProperty()
  fullName: string;
  @Expose()
  @IsNumber()
  @ApiProperty()
  totalBook: number;
  @Expose()
  @IsNumber()
  @ApiProperty()
  totlalPrice: number;
  @ApiProperty()
  bookCategories: ReportSalesCategoryDto2[];
}
export class ReportSalesCategoryDto2 {
  @Expose()
  @IsString()
  @Transform((value: TransformFnParams) => value.obj?.categoryId || '')
  @ApiProperty()
  categoryId: string;

  @IsString()
  @Expose()
  @ApiProperty()
  categoryName: string;

  @Expose()
  @IsNumber()
  @ApiProperty()
  // @Transform((value: TransformFnParams) => Number(value.obj?.totalSales || 0))
  totalBook: number;

  @Expose()
  @IsNumber()
  @ApiProperty()
  totalPrice: number;
}
//หนังสือที่ถูกขาย

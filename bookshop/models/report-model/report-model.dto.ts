import { Expose, Transform, TransformFnParams } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

//หนังสือที่ถูกขายในแต่ละหมวดหมู่
export class ReportSalesCategoryDto {
  @Expose()
  @Transform((value: TransformFnParams) => value.obj?.categoryId || '')
  @IsString()
  categoryId: string;

  @IsString()
  @Expose()
  @Transform(
    (value: TransformFnParams) =>
      value.obj?.category?.find(() => true)?.categoryName || '',
  )
  categoryName: string;

  @Expose()
  @IsNumber()
  numberOfSales: number;
}

// export class ReportSalesCategoryDto {
//   @Expose()
//   @Transform((value: TransformFnParams) => value.obj?.categoryId || '')
//   @IsString()
//   categoryId: string;

//   @IsString()
//   @Expose()
//   @Transform(
//     (value: TransformFnParams) =>
//       value.obj?.category?.find(() => true)?.categoryName || '',
//   )
//   categoryName: string;

//   @Expose()
//   @IsNumber()
//   numberOfSales: number;
// }
export class ReportUserModelDto {
  @Expose()
  @IsString()
  _id: string;
  @Expose()
  @IsString()
  username: string;
  @Expose()
  @IsString()
  firstName: string;
  @Expose()
  @IsString()
  lastName: string;
  @Expose()
  @IsString()
  fullName: string;
  @Expose()
  @IsNumber()
  buyBookCount: number;
  @Expose()
  @IsNumber()
  buyBook: number;
  @Expose()
  @IsDate()
  lastPurchaseDate: Date;
  @Expose()
  @IsDate()
  creeatedAt: Date;
  @Expose()
  @IsDate()
  updatedAt: Date;
  //A=Active, I=Inactive, D=Deleted
  @Expose()
  @IsString()
  status: string;
  //admin, member
  @Expose()
  @IsString()
  role: string;
}

//หนังสือที่ถูกขาย

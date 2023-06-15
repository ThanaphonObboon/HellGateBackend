import { Expose, Transform } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class AdjustInventoriesDto {
  @Expose()
  @IsNumber()
  @Transform((value) => Number(value.obj?.amount || 0))
  amount: number;
}

export class StockHistoryDto {
  @Expose()
  @IsNumber()
  amount: number;
  //stockเก่า
  @Expose()
  @IsNumber()
  oldstock: number;
  //stockใหม่
  @Expose()
  @IsNumber()
  stock: number;
  //S=Sold, A=Adject
  @Expose()
  @IsString()
  actionType: string;
  @Expose()
  @IsDate()
  createdAt: Date;
  @Expose()
  @IsString()
  @Transform((value) => value.obj?.bookId)
  bookId: string;
  @Transform((value) => value.obj?.book?.find(() => true)?.title || null)
  @Expose()
  @IsString()
  title: string;
  @Transform((value) => value.obj?.book?.find(() => true)?.CoverImage || null)
  @Expose()
  @IsString()
  CoverImage: string;
  @Transform((value) => value.obj?.book?.find(() => true)?.description || null)
  @Expose()
  @IsString()
  description: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class AdjustInventoriesDto {
  @Expose()
  @IsNumber()
  @Transform((value) => Number(value.obj?.amount || 0))
  @ApiProperty()
  amount: number;
}

export class StockHistoryDto {
  @Expose()
  @IsNumber()
  @ApiProperty()
  amount: number;
  //stockเก่า
  @Expose()
  @IsNumber()
  @ApiProperty()
  oldstock: number;
  //stockใหม่
  @Expose()
  @IsNumber()
  @ApiProperty()
  stock: number;
  //S=Sold, A=Adject
  @Expose()
  @IsString()
  @ApiProperty()
  actionType: string;
  @Expose()
  @IsDate()
  @ApiProperty()
  createdAt: Date;
  @Expose()
  @IsString()
  @Transform((value) => value.obj?.bookId)
  @ApiProperty()
  bookId: string;
  @Transform((value) => value.obj?.book?.find(() => true)?.title || null)
  @Expose()
  @IsString()
  title: string;
  @Transform((value) => value.obj?.book?.find(() => true)?.CoverImage || null)
  @Expose()
  @IsString()
  @ApiProperty()
  CoverImage: string;
  @Transform((value) => value.obj?.book?.find(() => true)?.description || null)
  @Expose()
  @IsString()
  @ApiProperty()
  description: string;
}

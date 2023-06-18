import { Type } from '@nestjs/passport';
import { Expose, Transform } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CategoryDto {
  @Expose()
  @Transform((value) => value.obj._id.toString())
  @IsString()
  _id: string;
  @Expose()
  @IsString()
  categoryName: string;
  @Expose()
  @IsDate()
  creeatedAt: Date;
  @Expose()
  @IsDate()
  updatedAt: Date;
  @Expose()
  @IsString()
  status: string;
  @Expose()
  @IsNumber()
  bookInCategory: number;
}

export class CreateCategoryDto {
  @IsString()
  categoryName: string;
}

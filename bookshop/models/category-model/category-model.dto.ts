import { Type } from '@nestjs/passport';
import { IsDate, IsNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CategoryDto {
  @IsString()
  _id: string;
  @IsString()
  categoryName: string;
  @IsDate()
  creeatedAt: Date;
  @IsDate()
  updatedAt: Date;
  @IsString()
  status: string;
  @IsNumber()
  bookInCategory: number;
}

export class CreateCategoryDto {
  @IsString()
  categoryName: string;
}

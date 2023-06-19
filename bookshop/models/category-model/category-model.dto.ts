import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class CategoryDto {
  @ApiProperty()
  @Expose()
  @Transform((value) => value.obj._id.toString())
  @IsString()
  _id: string;
  @ApiProperty()
  @Expose()
  @IsString()
  categoryName: string;
  @Expose()
  @IsDate()
  @ApiProperty()
  creeatedAt: Date;
  @Expose()
  @IsDate()
  @ApiProperty()
  updatedAt: Date;
  @Expose()
  @IsString()
  @ApiProperty()
  status: string;
  @Expose()
  @IsNumber()
  @ApiProperty()
  bookInCategory: number;
}

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  categoryName: string;
}

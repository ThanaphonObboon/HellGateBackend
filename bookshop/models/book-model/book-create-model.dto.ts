import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CreateBookDto {
  @ApiProperty()
  @IsString()
  //ชื่อผู้เขียน
  author: string;
  @ApiProperty()
  @IsString()
  title: string;
  @ApiProperty()
  @IsString()
  description: string;
  // @Transform((value) => Number(value))
  @ApiProperty()
  @IsNumber()
  price: number;
  @ApiProperty()
  @IsString()
  categoryId: string;
}

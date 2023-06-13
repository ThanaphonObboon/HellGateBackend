import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  //ชื่อผู้เขียน
  author: string;
  @IsString()
  title: string;
  @IsString()
  description: string;
  // @Transform((value) => Number(value))
  @IsNumber()
  price: number;
  @IsString()
  categoryId: string;
}

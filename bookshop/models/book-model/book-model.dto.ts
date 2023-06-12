import { IsDate, IsNumber, IsString } from 'class-validator';

export class BookDto {
  @IsString()
  bookId: string;
  @IsString()
  //ชื่อผู้เขียน
  author: string;
  @IsString()
  title: string;
  @IsString()
  description: string;
  @IsString()
  bookType: string;
  @IsNumber()
  price: number;
  @IsNumber()
  stock: number;
  @IsNumber()
  numberOfSales: number;
  //   salesHistories: ISaleHistory[];
  //   stockHistories: IStockHistory[];
  @IsDate()
  creeatedAt: Date;
  @IsDate()
  updatedAt: Date;
  @IsString() //A=Actived, R=Removed
  status: string;
}

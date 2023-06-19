import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';

export class LoginLockedModel {
  @Type(() => String)
  @IsString()
  @ApiProperty()
  username: string;
  @Type(() => Number)
  @IsNumber()
  @ApiProperty()
  loginFailedCount: number;
  @Type(() => Date)
  @IsDate()
  @ApiProperty()
  loginLockedExpAt?: Date;
}

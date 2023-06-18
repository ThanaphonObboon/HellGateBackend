import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';

export class LoginLockedModel {
  @Type(() => String)
  @IsString()
  username: string;
  @Type(() => Number)
  @IsNumber()
  loginFailedCount: number;
  @Type(() => Date)
  @IsDate()
  loginLockedExpAt?: Date;
}

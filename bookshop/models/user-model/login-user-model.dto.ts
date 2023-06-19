import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';

export class LoginModel {
  @ApiProperty({ type: String })
  @IsNotEmpty({ message: 'กรุณากรอกชื่อผู้ใช้งาน' })
  @Matches(/^[A-z0-9]{5,20}$/, {
    message: 'ชื่อผู้ใช้งานต้องมีความยาว 5-20 ตัวอักษรและตัวเลข',
  })
  username: string;
  @ApiProperty({ type: String })
  @IsNotEmpty({ message: 'กรุณากรอกรหัสผ่าน' })
  @Matches(/^[A-z0-9!@#$%^&*]{5,20}$/, {
    message: 'รหัสผ่านต้องมีความยาว 5-20 ตัวอักษรตัวเลขและตัวพิเศษ',
  })
  password: string;
}

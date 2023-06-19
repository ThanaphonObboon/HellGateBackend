import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';
import { IsComparePassword } from 'pipes/custom-validation.pipe';

export class CreateUserModelDto {
  @ApiProperty({ type: String })
  @IsNotEmpty({ message: 'กรุณากรอกชื่อ' })
  firstName: string;
  @ApiProperty({ type: String })
  @IsNotEmpty({ message: 'กรุณากรอกนามสกุล' })
  lastName: string;
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
  @ApiProperty({ type: String })
  @IsNotEmpty({ message: 'กรุณากรอกรหัสผ่าน' })
  @IsComparePassword('password', { message: 'รหัสผ่านไม่ตรงกัน' })
  cpassword: string;
  @ApiProperty({ type: String })
  role = 'member';
}

export class UpdateUserModelDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'กรุณากรอกชื่อ' })
  firstName: string;
  @ApiProperty()
  @IsNotEmpty({ message: 'กรุณากรอกนามสกุล' })
  lastName: string;
}

export class UpdateUserPasswordModelDto {
  @IsNotEmpty({ message: 'กรุณากรอกรหัสผ่าน' })
  @Matches(/^[A-z0-9!@#$%^&*]{5,20}$/, {
    message: 'รหัสผ่านต้องมีความยาว 5-20 ตัวอักษรตัวเลขและตัวพิเศษ',
  })
  @ApiProperty()
  currentPassword: string;
  @IsNotEmpty({ message: 'กรุณากรอกรหัสผ่าน' })
  @Matches(/^[A-z0-9!@#$%^&*]{5,20}$/, {
    message: 'รหัสผ่านต้องมีความยาว 5-20 ตัวอักษรตัวเลขและตัวพิเศษ',
  })
  @ApiProperty()
  newPassword: string;
  @IsNotEmpty({ message: 'กรุณากรอกรหัสผ่าน' })
  @ApiProperty()
  @IsComparePassword('newPassword', { message: 'รหัสผ่านไม่ตรงกัน' })
  rePassword: string;
}

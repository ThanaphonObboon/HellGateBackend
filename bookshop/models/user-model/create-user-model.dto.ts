import { IsNotEmpty, Matches } from 'class-validator';
import { IsComparePassword } from 'pipes/custom-validation.pipe';

export class CreateUserModelDto {
  @IsNotEmpty({ message: 'กรุณากรอกชื่อ' })
  firstName: string;
  @IsNotEmpty({ message: 'กรุณากรอกนามสกุล' })
  lastName: string;
  @IsNotEmpty({ message: 'กรุณากรอกชื่อผู้ใช้งาน' })
  @Matches(/^[A-z0-9]{5,20}$/, {
    message: 'ชื่อผู้ใช้งานต้องมีความยาว 5-20 ตัวอักษรและตัวเลข',
  })
  username: string;
  @IsNotEmpty({ message: 'กรุณากรอกรหัสผ่าน' })
  @Matches(/^[A-z0-9!@#$%^&*]{5,20}$/, {
    message: 'รหัสผ่านต้องมีความยาว 5-20 ตัวอักษรตัวเลขและตัวพิเศษ',
  })
  password: string;
  @IsNotEmpty({ message: 'กรุณากรอกรหัสผ่าน' })
  @IsComparePassword('password', { message: 'รหัสผ่านไม่ตรงกัน' })
  cpassword: string;
  role = 'member';
}

export class UpdateUserModelDto {
  @IsNotEmpty({ message: 'กรุณากรอกชื่อ' })
  firstName: string;
  @IsNotEmpty({ message: 'กรุณากรอกนามสกุล' })
  lastName: string;
}

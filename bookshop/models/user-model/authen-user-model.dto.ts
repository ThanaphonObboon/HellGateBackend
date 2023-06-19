import { ApiProperty } from '@nestjs/swagger';
import { UserModelDto } from './user-model.dto';

export class AuthenUserModelDto {
  @ApiProperty({ type: UserModelDto })
  account: UserModelDto;
  @ApiProperty({ type: String })
  token: string;
}

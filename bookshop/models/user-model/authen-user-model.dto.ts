import { UserModelDto } from './user-model.dto';

export class AuthenUserModelDto {
  account: UserModelDto;
  token: string;
}

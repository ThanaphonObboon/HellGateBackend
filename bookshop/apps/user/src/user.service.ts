import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserModelDto } from 'models/user-model.dto';
import { UserRepository } from 'repositories/user.repository';
import { User } from 'schema/user.schema';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async getUserLists(): Promise<UserModelDto[]> {
    const data: User[] = await this.userRepository.find();
    return plainToInstance(UserModelDto, data);
  }
}

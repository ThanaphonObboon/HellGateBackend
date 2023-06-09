import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateUserModelDto } from 'models/user-model/create-user-model.dto';
import { UserModelDto } from 'models/user-model/user-model.dto';
import { UserRepository } from 'repositories/user.repository';
import { User } from 'schema/user.schema';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async getUserLists(): Promise<UserModelDto[]> {
    const data: User[] = await this.userRepository.find();
    return plainToInstance(UserModelDto, data);
  }
  async createUser(req: CreateUserModelDto): Promise<UserModelDto> { 
    const data: User = await this.userRepository.create(plainToInstance(User, req));
    return plainToInstance(UserModelDto, data);
  }
}

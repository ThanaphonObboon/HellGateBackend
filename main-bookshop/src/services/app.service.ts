import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserModel } from 'src/models/create-user-model';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  getHello(): object {
    return this.userModel.find();
  }
  async createItem(req: CreateUserModel): Promise<string> {
    console.log(req);
    const data = new this.userModel({ ...req });
    await data.save();
    return 'done';
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { USER_MODEL } from 'src/database/constants';
import { User } from './user.interface';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_MODEL)
    private userModel: Model<User>,
  ) {}

  async findOne(email: string): Promise<User | null> {
    return await this.userModel.findOne({
      email: email,
    });
  }

  async create(name: string, email: string, password: string): Promise<User> {
    const newUser = new this.userModel({ name, email, password });
    return await newUser.save();
  }
}

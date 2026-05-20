import { InjectModel } from '@nestjs/mongoose';
import { User } from '../domain/user.entity';
import type { UserDocument, UserModelType } from '../domain/user.entity';
import { NotFoundException } from '@nestjs/common';

export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
  ) {}

  async findById(id: string): Promise<UserDocument> {
    const user = await this.UserModel.findById(id);
    if (!user) {
      throw new NotFoundException('id', 'User Not Found');
    }
    return user;
  }

  async save(user: UserDocument): Promise<void> {
    await user.save();
    return;
  }

  async deleteById(id: string): Promise<void> {
    const userDeleted = await this.UserModel.findByIdAndDelete(id);
    if (userDeleted === null) {
      throw new NotFoundException('id', 'User Not Found');
    }
    return;
  }
}

import { InjectModel } from '@nestjs/mongoose';
import { User } from '../domain/user.entity';
import type { UserDocument, UserModelType } from '../domain/user.entity';
import { NotFoundException } from '@nestjs/common';
import {
  PaginationInput,
  SortDirection,
} from '../../../core/dto/pagination.request.dto';

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

  async findAll(pagination: PaginationInput): Promise<{
    users: UserDocument[];
    totalCount: number;
  }> {
    const sortBy = pagination.sortBy ?? 'createdAt';
    let sortDirection = pagination.sortDirection;
    if (!pagination.sortDirection) {
      sortDirection = SortDirection.Asc;
    }
    // const sortDirection =
    //   paginationInput.sortDirection === SortDirection.Asc ? 1 : -1;
    const pageNumber = pagination.pageNumber ?? 1;
    const pageSize = pagination.pageSize ?? 10;

    const skip = (pageNumber - 1) * pageSize;
    const users = await this.UserModel.find()
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize);

    const totalCount = await this.UserModel.countDocuments();

    return { users, totalCount };
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

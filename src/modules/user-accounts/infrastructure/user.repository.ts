import { InjectModel } from '@nestjs/mongoose';
import { User } from '../domain/user.entity';
import type { UserDocument, UserModelType } from '../domain/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SortDirection } from '../../../core/dto/pagination.request.dto';
import { UserPaginationRequest } from '../dto/user-pagination.request.dto';

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

  async findAll(pagination: UserPaginationRequest): Promise<{
    users: UserDocument[];
    totalCount: number;
  }> {
    const sortBy = pagination.sortBy ?? 'createdAt';
    const sortDirection =
      pagination.sortDirection === SortDirection.Asc ? 1 : -1;
    const pageNumber = pagination.pageNumber ?? 1;
    const pageSize = pagination.pageSize ?? 10;
    const searchLoginTerm = pagination.searchLoginTerm ?? null;
    const searchEmailTerm = pagination.searchEmailTerm ?? null;

    const filter: Record<string, any> = {};
    if (searchLoginTerm && searchEmailTerm) {
      filter.$or = [
        { login: { $regex: searchLoginTerm, $options: 'i' } },
        { email: { $regex: searchEmailTerm, $options: 'i' } },
      ];
    } else {
      if (searchLoginTerm) {
        filter.login = { $regex: searchLoginTerm, $options: 'i' };
      }
      if (searchEmailTerm) {
        filter.email = { $regex: searchEmailTerm, $options: 'i' };
      }
    }

    const skip = (pageNumber - 1) * pageSize;
    const users = await this.UserModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize);

    const totalCount = await this.UserModel.countDocuments(filter);

    return { users, totalCount };
  }

  async findByLoginOrEmail(login: string, email: string): Promise<void> {
    const user = await this.UserModel.find({
      $or: [{ login: login }, { email: email }],
    });
    if (user.length > 0) {
      throw new BadRequestException('login or email', 'User exist');
    }
    return;
  }

  async findByConfirmationCode(code: string): Promise<UserDocument> {
    const user = await this.UserModel.findOne({
      'confirmation.confirmationCode': code,
    });

    if (!user) {
      throw new BadRequestException('confirmationCode', 'Not Found');
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

import { InjectModel } from '@nestjs/mongoose';
import {
  User,
  type UserDocument,
  type UserModelType,
} from '../domain/users/user.entity';
import { UserPaginationRequest } from '../dto/user-pagination.request.dto';
import { SortDirection } from '../../../core/dto/pagination.request.dto';

export class UserQwRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
  ) {}

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
}

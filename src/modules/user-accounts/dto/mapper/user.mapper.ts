import { PaginationInput } from '../../../../core/dto/pagination.request.dto';
import { UserDocument } from '../../domain/user.entity';
import { UserResponseDto } from '../user.response.dto';

export class UserMapper {
  toResponseView(user: UserDocument): UserResponseDto {
    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  toPaginatedResponseView(
    users: UserDocument[],
    totalCount: number,
    pagination: PaginationInput,
  ) {
    const pageNumber = pagination.pageNumber ?? 1;
    const pageSize = pagination.pageSize ?? 10;
    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: users.map((user) => this.toResponseView(user)),
    };
  }
}

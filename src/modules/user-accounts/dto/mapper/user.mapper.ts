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
}

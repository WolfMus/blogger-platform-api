import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../domain/user.entity';
import type { UserModelType } from '../domain/user.entity';
import { CreateUserRequestDto } from '../dto/create-user.request.dto';
import bcrypt from 'bcrypt';
import { CreateUserDomainDto } from '../domain/dto/create-user.domain.dto';
import { UserRepository } from '../infrastructure/user.repository';
import { UserMapper } from '../dto/mapper/user.mapper';
import { PaginatedUserResponseDto } from '../dto/post-paginated-view.response.dto';
import { UserPaginationRequest } from '../dto/user-pagination.request.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
    private userRepo: UserRepository,
    private userMapper: UserMapper,
  ) {}

  async findAll(
    pagination: UserPaginationRequest,
  ): Promise<PaginatedUserResponseDto> {
    const { users, totalCount } = await this.userRepo.findAll(pagination);
    return this.userMapper.toPaginatedResponseView(
      users,
      totalCount,
      pagination,
    );
  }

  async create(dto: CreateUserRequestDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const createUserData: CreateUserDomainDto = {
      login: dto.login,
      email: dto.email,
      passwordHash: passwordHash,
    };
    const user = this.UserModel.createInstance(createUserData);
    await this.userRepo.save(user);
    return this.userMapper.toResponseView(user);
  }

  async delete(id: string): Promise<void> {
    await this.userRepo.deleteById(id);
    return;
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../domain/user.entity';
import type { UserModelType } from '../domain/user.entity';
import { CreateUserRequestDto } from '../dto/create-user.request.dto';
import { CreateUserDomainDto } from '../domain/dto/create-user.domain.dto';
import { UserRepository } from '../infrastructure/user.repository';
import { UserMapper } from '../dto/mapper/user.mapper';
import { PaginatedUserResponseDto } from '../dto/post-paginated-view.response.dto';
import { UserPaginationRequest } from '../dto/user-pagination.request.dto';
import { CryptoService } from './crypto.service';
import { EmailService } from '../../notifications/applications/email.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
    private userRepo: UserRepository,
    private userMapper: UserMapper,
    private cryptoService: CryptoService,
    private emailService: EmailService,
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
    const passwordHash = await this.cryptoService.generatePasswordHash(
      dto.password,
    );
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

  async registerUser(dto: CreateUserRequestDto): Promise<void> {
    // user exists?
    await this.userRepo.findByLoginOrEmail(dto.login, dto.email);

    // generate hash and create user domain dto
    const passwordHash = await this.cryptoService.generatePasswordHash(
      dto.password,
    );
    const createUserData: CreateUserDomainDto = {
      login: dto.login,
      email: dto.email,
      passwordHash: passwordHash,
    };

    // create user instance
    const user = this.UserModel.createInstance(createUserData);

    // create confirmation code and expires date
    user.setConfirmationCode();

    // save user
    await this.userRepo.save(user);

    // send confirmation code on user's email
    await this.emailService.sendConfirmationEmail(
      user.email,
      user.confirmation.confirmationCode!,
    );
    return;
  }

  async confirmRegistration(code: string): Promise<void> {
    // find user by confirmation code
    const user = await this.userRepo.findByConfirmationCode(code);
    // is code expired?
    if (user.confirmation.confirmationExpireDate!.getTime() < Date.now()) {
      throw new BadRequestException('confirmationExpireDate', 'Code Expired');
    }
    // change confirmation status
    user.isConfirmed();
    // save user
    return await this.userRepo.save(user);
  }
}

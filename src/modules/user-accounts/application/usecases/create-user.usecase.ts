import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserRequestDto } from '../../dto/input/create-user.request.dto';
import { User, type UserModelType } from '../../domain/users/user.entity';
import { CryptoService } from '../crypto.service';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDomainDto } from '../../domain/users/dto/create-user.domain.dto';
import { UserRepository } from '../../infrastructure/user.repository';
import { UserMapper } from '../../dto/mapper/user.mapper';
import { UserResponseDto } from '../../dto/user.response.dto';

export class CreateUserCommand {
  constructor(public dto: CreateUserRequestDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<
  CreateUserCommand,
  UserResponseDto
> {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
    private cryptoService: CryptoService,
    private userRepo: UserRepository,
    private userMapper: UserMapper,
  ) {}
  async execute(command: CreateUserCommand): Promise<UserResponseDto> {
    // user exists?
    await this.userRepo.findByLoginAndEmail(
      command.dto.login,
      command.dto.email,
    );

    // generate hash and create user domain dto
    const passwordHash = await this.cryptoService.generatePasswordHash(
      command.dto.password,
    );
    const createUserData: CreateUserDomainDto = {
      login: command.dto.login,
      email: command.dto.email,
      passwordHash: passwordHash,
    };

    // create user instance
    const user = this.UserModel.createInstance(createUserData);

    // save user
    await this.userRepo.save(user);

    return this.userMapper.toResponseView(user);
  }
}

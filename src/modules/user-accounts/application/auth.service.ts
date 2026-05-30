import { HttpStatus, Injectable } from '@nestjs/common';
import { LoginUserRequestDto } from '../dto/input/login-user.request.dto';
import { UserRepository } from '../infrastructure/user.repository';
import { CryptoService } from './crypto.service';
import { JwtService } from '@nestjs/jwt';
import {
  DomainException,
  Extension,
} from '../../../core/exceptions/domain-exception';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userRepo: UserRepository,
    private cryptoService: CryptoService,
  ) {}

  async login(dto: LoginUserRequestDto): Promise<{ accessToken: string }> {
    // find user by login or email
    const user = await this.userRepo.findByLoginOrEmail(dto.loginOrEmail);

    // is password correct
    if (!(await this.cryptoService.compare(dto.password, user.passwordHash))) {
      throw new DomainException({
        code: HttpStatus.UNAUTHORIZED,
        message: 'Unauthorized',
        extensions: [new Extension('Incorrect Data', 'password')],
      });
    }

    // create payload
    const payload = {
      sub: user._id.toString(),
      login: user.login,
    };

    // create access token
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}

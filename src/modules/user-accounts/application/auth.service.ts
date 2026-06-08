import { HttpStatus, Injectable } from '@nestjs/common';
import { LoginUserRequestDto } from '../dto/input/login-user.request.dto';
import { UserRepository } from '../infrastructure/user.repository';
import { CryptoService } from './crypto.service';
import { JwtService } from '@nestjs/jwt';
import {
  DomainException,
  Extension,
} from '../../../core/exceptions/domain-exception';
import {
  Session,
  type SessionModelType,
} from '../domain/sessions/session.entity';
import { InjectModel } from '@nestjs/mongoose';
import { SessionRepository } from '../infrastructure/sessions/session.repository';
import { CreateSessionDto } from '../domain/sessions/dto/create-session.domain.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Session.name)
    private SessionModel: SessionModelType,
    private jwtService: JwtService,
    private userRepo: UserRepository,
    private cryptoService: CryptoService,
    private sessionRepo: SessionRepository,
  ) {}

  async login(
    dto: LoginUserRequestDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
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

    // create refresh token and save in DB
    const refreshToken = await this.jwtService.signAsync(
      { sub: user._id.toString(), login: user.login },
      { expiresIn: '24h', secret: 'refresh-token-secret' },
    );
    const createSessionDto: CreateSessionDto = {
      refreshToken: refreshToken,
      userId: user._id.toString(),
      expiresIn: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
    const session = this.SessionModel.createInstance(createSessionDto);
    await this.sessionRepo.save(session);

    // create payload
    const payload = {
      sub: user._id.toString(),
      login: user.login,
    };

    // create access token
    const accessToken = this.jwtService.sign(payload);
    return { accessToken, refreshToken };
  }
}

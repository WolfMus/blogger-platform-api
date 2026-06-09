import { HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from '../infrastructure/user.repository';
import { CryptoService } from './crypto.service';
import {
  DomainException,
  Extension,
} from '../../../core/exceptions/domain-exception';

@Injectable()
export class AuthService {
  constructor(
    private userRepo: UserRepository,
    private cryptoService: CryptoService,
  ) {}

  async validateUser(
    loginOrEmail: string,
    pass: string,
  ): Promise<{ id: string } | null> {
    const user = await this.userRepo.findByLoginOrEmail(loginOrEmail);
    if (!user) {
      throw new DomainException({
        code: HttpStatus.BAD_REQUEST,
        message: 'Not Found',
        extensions: [new Extension('Confirmation Code Not Found', 'code')],
      });
    }
    const isPasswordValid = await this.cryptoService.compare(
      pass,
      user.passwordHash,
    );
    if (!user) {
      return null;
    }
    if (!isPasswordValid) {
      return null;
    }

    return { id: user._id.toString() };
  }
}

import { Injectable } from '@nestjs/common';
import { UserRepository } from '../infrastructure/user.repository';
import { CryptoService } from './crypto.service';

@Injectable()
export class AuthService {
  constructor(
    private userRepo: UserRepository,
    private cryptoService: CryptoService,
  ) {}

  async validateUser(
    login: string,
    pass: string,
  ): Promise<{ id: string } | null> {
    const user = await this.userRepo.findByLoginOrEmail(login);
    const isPasswordValid = await this.cryptoService.compare(
      user.passwordHash,
      pass,
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

import { HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../application/auth.service';
import { DomainException } from '../../../core/exceptions/domain-exception';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new DomainException({
        code: HttpStatus.UNAUTHORIZED,
        message: 'Unauthorized',
      });
    }
    return user;
  }
}

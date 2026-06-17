import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SessionRepository } from '../../infrastructure/sessions/session.repository';
interface JwtPayload {
  sub: string;
  login: string;
}
@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private sessionRepo: SessionRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies['refreshToken'] as string,
      ]),
      secretOrKey: 'secret-key',
      passReqToCallback: true,
    });
  }

  validate(payload: JwtPayload): { userId: string } {
    const rT = await this.sessionRepo.findByRefreshToken(payload);
    return { userId: payload.sub };
  }
}

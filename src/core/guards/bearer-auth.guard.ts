import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserRepository } from '../../modules/user-accounts/infrastructure/user.repository';
import { JwtPayloadInterface } from '../../modules/user-accounts/application/types/jwt-payload.interface';

@Injectable()
export class BearerAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userRepo: UserRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();
    const request: Request = ctx.getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return false;
    }

    const [authType, token] = authHeader.split(' ');

    // Auth type = BEARER
    if (authType === 'Bearer') {
      this.jwtService.verify(token);
      const decodedToken = this.jwtService.decode<JwtPayloadInterface>(token);
      if (new Date(decodedToken.exp * 1000) < new Date()) {
        return false;
      }
      const user = await this.userRepo.findById(decodedToken.sub);
      if (!user) {
        return false;
      }

      request['userId'] = decodedToken.sub;
      return true;
    }
    return false;
  }
}

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const ctx = context.switchToHttp();
    const request: Request = ctx.getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return false;
    }

    const [authType, token] = authHeader.split(' ');

    // Auth type = BASIC
    if (authType === 'Basic') {
      const [username, password] = Buffer.from(token, 'base64')
        .toString('utf8')
        .split(':');

      if (username !== 'admin' || password !== 'qwerty') {
        return false;
      }

      return true;
    }
    return false;
  }
}

import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { CookiesGuard, JwtRefreshGuard } from '../guards/refrresh-token/refresh-token.guard';
import { DomainException } from '../../../core/exceptions/domain-exception';
import { SessionRepository } from '../infrastructure/sessions/session.repository';
import { SecurityService } from '../application/security.service';

@Controller('security/devices')
export class SessionsController {
  constructor(private securityService: SecurityService) {}
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @Get()
  async getActiveSessions(@Req() req: Request) {
    const userId = (req.user as { userId: string }).userId;
    
  }
}

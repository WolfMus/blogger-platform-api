import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtRefreshGuard } from '../guards/refrresh-token/refresh-token.guard';
import { SecurityService } from '../application/security.service';

@Controller('security/devices')
export class SessionsController {
  constructor(private securityService: SecurityService) {}
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @Get()
  async getActiveSessions(@Req() req: Request) {
    console.log('Request user:', req.user);
    const userId = (req.user as { userId: string }).userId;
    return await this.securityService.getActiveSessions(userId);
  }
}

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
import { SessionService } from '../application/session.service';

@Controller('security/devices')
export class SessionsController {
  constructor(private sessionService: SessionService) {}
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @Get()
  async getActiveSessions(@Req() req: Request) {
    const userId = (req.user as { userId: string }).userId;
    return await this.sessionService.getActiveSessions(userId);
  }
}

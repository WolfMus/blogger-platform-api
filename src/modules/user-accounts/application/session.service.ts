import { Injectable } from '@nestjs/common';
import { SessionRepository } from '../infrastructure/sessions/session.repository';
import { SessionMapper } from '../dto/mapper/session.mapper';

@Injectable()
export class SessionService {
  constructor(
    private sessionRepo: SessionRepository,
    private sessionMapper: SessionMapper,
  ) {}
  async getActiveSessions(userId: string) {
    const sessions = await this.sessionRepo.findAllByUserId(userId);
    if (sessions === null) {
      throw new Error('No active sessions found for the user');
    }
    return this.sessionMapper.toResponseView(sessions);
  }
}

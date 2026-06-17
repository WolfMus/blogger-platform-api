import { Injectable } from '@nestjs/common';
import { SessionRepository } from '../infrastructure/sessions/session.repository';

@Injectable()
export class SecurityService {
  constructor(private sessionRepo: SessionRepository) {}
  async getActiveSessions(userId: string) {
    const sessions = await this.sessionRepo.findAllByUserId(userId);
    if (sessions === null) {
      throw new Error('No active sessions found for the user');
    }
    return sessions;
  }
}

import { Injectable } from '@nestjs/common';
import { SessionRepository } from '../infrastructure/sessions/session.repository';

@Injectable()
export class SecurityService {
  constructor(private sessionRepo: SessionRepository) {}
  async getActiveSessions(userId: string) {
    return await this.sessionRepo.findAllByUserId(userId);
  }
}

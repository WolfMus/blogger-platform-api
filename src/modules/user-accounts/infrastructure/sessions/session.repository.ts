import { Injectable } from '@nestjs/common';
import {
  SessionDocument,
  type SessionModelType,
} from '../../domain/sessions/session.entity';

@Injectable()
export class SessionRepository {
  constructor(private sessionModel: SessionModelType) {}
  async save(session: SessionDocument): Promise<void> {
    await session.save();
    return;
  }

  async findAllByUserId(userId: string): Promise<SessionDocument[] | null> {
    const sessions = await this.sessionModel.find({ userId });
    if (!sessions || sessions.length === 0) {
      return null;
    }
    return sessions;
  }
}

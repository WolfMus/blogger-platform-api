import { Injectable } from '@nestjs/common';
import { Session, SessionDocument } from '../../domain/sessions/session.entity';
import type { SessionModelType } from '../../domain/sessions/session.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SessionRepository {
  constructor(
    @InjectModel(Session.name)
    private sessionModel: SessionModelType,
  ) {}
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

  async isRefreshTokenExists(refreshToken: string): Promise<boolean> {
    const session = await this.sessionModel.findOne({ refreshToken });
    if (!session) return false;
    return true;
  }
}

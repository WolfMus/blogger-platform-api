import { Injectable } from '@nestjs/common';
import { SessionDocument } from '../../domain/sessions/session.entity';

@Injectable()
export class SessionRepository {
  async save(session: SessionDocument): Promise<void> {
    await session.save();
    return;
  }
}

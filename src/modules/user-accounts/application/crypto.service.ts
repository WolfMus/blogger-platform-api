import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class CryptoService {
  async generatePasswordHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  compare(password: string, passwordHash: string) {
    return bcrypt.compare(password, passwordHash);
  }
}

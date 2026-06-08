import { Module } from '@nestjs/common';
import { UserController } from './api/user.controller';
import { UserService } from './application/user.service';
import { UserRepository } from './infrastructure/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/users/user.entity';
import { UserMapper } from './dto/mapper/user.mapper';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { CryptoService } from './application/crypto.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { JwtModule } from '@nestjs/jwt';
import { Session, SessionSchema } from './domain/sessions/session.entity';
import { UserQwRepository } from './infrastructure/user-query.repository';
import { SessionRepository } from './infrastructure/sessions/session.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
    NotificationsModule,
    JwtModule.register({
      global: true,
      secret: 'access-token-secret',
      signOptions: { expiresIn: '5m' },
    }),
  ],
  controllers: [UserController, AuthController],
  providers: [
    UserService,
    UserRepository,
    UserQwRepository,
    UserMapper,
    SessionRepository,
    AuthService,
    CryptoService,
  ],
  exports: [UserRepository],
})
export class UserAccountsModule {}

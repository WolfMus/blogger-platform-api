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
import { LoginUserUseCase } from './application/usecases/login.usecase';
import { RegistrationUserUseCase } from './application/usecases/registration.usecase';
import { CreateUserUseCase } from './application/usecases/create-user.usecase';
import { ConfirmRegistrationUseClass } from './application/usecases/confirm-registration.usecase';
import { SendRecoveryCodeUseClass } from './application/usecases/send-recovery-code.usecase';
import { ResetPasswordUseCase } from './application/usecases/reset-password.usecase';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './guards/local.strategy';
import { JwtStrategy } from './guards/jwt.strategy';
import { ResendConfirmationCodeUseCase } from './application/usecases/resend-confirmation-code.usecase';

const userUseCases = [
  CreateUserUseCase,
  LoginUserUseCase,
  RegistrationUserUseCase,
  ConfirmRegistrationUseClass,
  RegistrationUserUseCase,
  SendRecoveryCodeUseClass,
  ResetPasswordUseCase,
  ResendConfirmationCodeUseCase,
];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
    NotificationsModule,
    JwtModule.register({
      global: true,
      secret: 'secret-key',
      signOptions: { expiresIn: '5m' },
    }),
    PassportModule,
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
    ...userUseCases,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [UserRepository, JwtStrategy],
})
export class UserAccountsModule {}

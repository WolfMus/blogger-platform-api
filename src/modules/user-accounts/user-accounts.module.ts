import { Module } from '@nestjs/common';
import { UserController } from './api/user.controller';
import { UserService } from './application/user.service';
import { UserRepository } from './infrastructure/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/user.entity';
import { UserMapper } from './dto/mapper/user.mapper';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { CryptoService } from './application/crypto.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    NotificationsModule,
  ],
  controllers: [UserController, AuthController],
  providers: [
    UserService,
    UserRepository,
    UserMapper,
    AuthService,
    CryptoService,
  ],
})
export class UserAccountsModule {}

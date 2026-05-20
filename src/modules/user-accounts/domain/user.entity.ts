import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CreateUserDomainDto } from './dto/create-user.domain.dto';
import { ApiSchema } from '@nestjs/swagger';
import { HydratedDocument, Model } from 'mongoose';

@ApiSchema({ name: 'User Entity' })
@Schema()
export class User {
  @Prop({ type: String, required: true })
  login: string;
  @Prop({ type: String, required: true })
  email: string;
  @Prop({ type: String, required: true })
  passwordHash: string;
  @Prop({ type: Date, required: true })
  createdAt: Date;
  @Prop({ type: Date, default: null })
  updatedAt: Date;

  static createInstance(dto: CreateUserDomainDto): UserDocument {
    const user = new this();
    user.login = dto.login;
    user.email = dto.email;
    user.passwordHash = dto.passwordHash;
    user.createdAt = new Date();
    return user as UserDocument;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

// регистрирует методы сущности в схеме
UserSchema.loadClass(User);

// типизация документа
export type UserDocument = HydratedDocument<User>;

// типизация модели + статические методы
export type UserModelType = Model<UserDocument> & typeof User;

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiSchema } from '@nestjs/swagger';
import { HydratedDocument, Model } from 'mongoose';
import { CreateSessionDto } from './dto/create-session.domain.dto';

@ApiSchema({ name: 'Sessions' })
@Schema()
export class Session {
  @Prop({ type: String, required: true })
  refreshToken: string;
  @Prop({ type: String, required: true })
  userId: string;
  @Prop({ type: Date, required: true })
  expiresIn: Date;
  @Prop({ type: String, nullable: true, default: null })
  deviceInfo: null;

  static createInstance(dto: CreateSessionDto): SessionDocument {
    const session = new this();
    session.refreshToken = dto.refreshToken;
    session.userId = dto.userId;
    session.expiresIn = dto.expiresIn;
    return session as SessionDocument;
  }
}

export const SessionSchema = SchemaFactory.createForClass(Session);

// регистрирует методы сущности в схеме
SessionSchema.loadClass(Session);

// типизация документа
export type SessionDocument = HydratedDocument<Session>;

// типизация модели + статические методы
export type SessionModelType = Model<SessionDocument> & typeof Session;

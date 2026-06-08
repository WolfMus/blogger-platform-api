import { Prop } from '@nestjs/mongoose';

export class CreateSessionDto {
  @Prop({ type: String, required: true })
  refreshToken: string;
  @Prop({ type: String, required: true })
  userId: string;
  @Prop({ type: Date, required: true })
  expiresIn: Date;
}

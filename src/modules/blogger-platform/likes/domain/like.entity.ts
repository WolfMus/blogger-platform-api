import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikeStatus } from '../../posts/domain/post.entity';
import { HydratedDocument, Model } from 'mongoose';
import { CreateLikeEntityDto } from './dto/create-likes.entity.dto';

export enum EntityType {
  Post = 'Post',
  Comment = 'Comment',
}

@Schema({ collection: 'likes' })
export class Like {
  @Prop({ type: String, required: true })
  entityId: string;
  @Prop({ type: String, enum: EntityType, required: true })
  entityType: EntityType;
  @Prop({ type: String, required: true })
  userId: string;
  @Prop({ type: String, enum: LikeStatus, required: true })
  likeStatus: LikeStatus;

  static createInstance(dto: CreateLikeEntityDto): LikeDocument {
    const like = new this();
    like.entityId = dto.entityId;
    like.entityType = dto.entityType;
    like.userId = dto.userId;
    like.likeStatus = dto.likeStatus;
    return like as LikeDocument;
  }

  changeStatus(status: LikeStatus): void {
    this.likeStatus = status;
  }
}

export const LikeSchema = SchemaFactory.createForClass(Like);

// регистрирует методы сущности в схеме
LikeSchema.loadClass(Like);

// типизация документа
export type LikeDocument = HydratedDocument<Like>;

// типизация модели + статические методы
export type LikeModelType = Model<LikeDocument> & typeof Like;

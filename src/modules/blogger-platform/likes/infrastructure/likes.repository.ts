import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeDocument, type LikeModelType } from '../domain/like.entity';

@Injectable()
export class LikesRepository {
  constructor(
    @InjectModel(Like.name)
    private LikeModel: LikeModelType,
  ) {}

  async save(like: LikeDocument): Promise<void> {
    await like.save();
    return;
  }

  async delete(id: string): Promise<void> {
    await this.LikeModel.findByIdAndDelete(id);
    return;
  }

  async findByEntityIdAndUserId(
    entityId: string,
    userId: string,
  ): Promise<LikeDocument | null> {
    const like = await this.LikeModel.findOne({
      entityId: entityId,
      userId: userId,
    });
    if (!like) return null;
    return like;
  }
}

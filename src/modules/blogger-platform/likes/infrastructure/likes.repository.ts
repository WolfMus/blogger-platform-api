import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeDocument, type LikeModelType } from '../domain/like.entity';
import { LikeStatus } from '../../posts/domain/post.entity';

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
    entityId: string | string[],
    userId: string,
  ): Promise<LikeDocument | null> {
    const like = await this.LikeModel.findOne({
      entityId: entityId,
      userId: userId,
    });
    if (!like) return null;
    return like;
  }

  async findEntityIdAndLikeStatus(
    entityId: string[],
    userId: string,
  ): Promise<[string, LikeStatus][] | null> {
    const likes = await this.LikeModel.find({
      entityId: entityId,
      userId: userId,
    });
    if (!likes) return null;
    return likes.map((like) => [like.entityId, like.likeStatus]);
  }
}

import { Injectable } from '@nestjs/common';
import { LikeStatus, PostDocument } from '../../domain/post.entity';
import { PostResponseDto } from '../post.response.dto';

@Injectable()
export class PostMapper {
  toReponseView(post: PostDocument): PostResponseDto {
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: post.extendedLikesInfo.likesCount,
        dislikesCount: post.extendedLikesInfo.dislikesCount,
        myStatus: post.extendedLikesInfo.myStatus as LikeStatus,
        newestLikes: [],
      },
    };
  }
}

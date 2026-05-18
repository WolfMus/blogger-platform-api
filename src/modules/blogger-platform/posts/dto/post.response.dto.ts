import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { ExtendedLikesInfo, LikeStatus } from '../domain/post.entity';

@ApiSchema({ name: 'PostResponseDto' })
export class PostResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  shortDescription: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  blogId: string;

  @ApiProperty()
  blogName: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: ExtendedLikesInfo })
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
    newestLikes: [];
  };
}

import { ApiProperty } from '@nestjs/swagger';
import { BlogResponseDto } from '../../modules/blogger-platform/blogs/dto/blog.response.dto';
import { PostResponseDto } from '../../modules/blogger-platform/posts/dto/post.response.dto';

type AllowedReponseDto = BlogResponseDto | PostResponseDto;

export class PaginationResult<T extends AllowedReponseDto> {
  @ApiProperty({})
  pagesCount: number;

  @ApiProperty({})
  page: number;

  @ApiProperty({})
  pageSize: number;

  @ApiProperty({})
  totalCount: number;

  @ApiProperty({ isArray: true })
  items: T[];
}

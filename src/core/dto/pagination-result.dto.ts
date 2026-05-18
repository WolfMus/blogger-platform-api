import { ApiProperty } from '@nestjs/swagger';
import { BlogResponseDto } from '../../modules/blogger-platform/blogs/dto/blog.response.dto';

export class PaginationResult {
  @ApiProperty({})
  pagesCount: number;

  @ApiProperty({})
  page: number;

  @ApiProperty({})
  pageSize: number;

  @ApiProperty({})
  totalCount: number;

  @ApiProperty({ type: [BlogResponseDto] })
  items: BlogResponseDto[];
}

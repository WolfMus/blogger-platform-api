import { PaginationResult } from '../../../../../core/dto/pagination-result.dto';
import { PaginationInput } from '../../../../../core/dto/pagination.dto';
import { BlogDocument } from '../../domain/blog.entity';
import { BlogResponseDto } from '../blog.response.dto';

export class BlogMapper {
  toResponseView(blog: BlogDocument): BlogResponseDto {
    return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    };
  }

  toResponsePaginatedView(
    blogs: BlogDocument[],
    paginationInput: PaginationInput,
    totalCount: number,
  ): PaginationResult<BlogResponseDto> {
    return {
      pagesCount: Math.ceil(totalCount / paginationInput.pageSize),
      page: paginationInput.pageNumber,
      pageSize: paginationInput.pageSize,
      totalCount: blogs.length,
      items: blogs.map((blog) => this.toResponseView(blog)),
    };
  }
}

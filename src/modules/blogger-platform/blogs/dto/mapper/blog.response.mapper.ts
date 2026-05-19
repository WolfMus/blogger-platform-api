import { PaginationInput } from '../../../../../core/dto/pagination.request.dto';
import { BlogDocument } from '../../domain/blog.entity';
import { BlogResponseDto } from '../blog.response.dto';
import { PaginatedBlogResponseDto } from '../blog-paginated-view.response.dto';

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
  ): PaginatedBlogResponseDto {
    return {
      pagesCount: Math.ceil(totalCount / paginationInput.pageSize),
      page: paginationInput.pageNumber,
      pageSize: paginationInput.pageSize,
      totalCount: blogs.length,
      items: blogs.map((blog) => this.toResponseView(blog)),
    };
  }
}

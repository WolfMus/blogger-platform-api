import { PaginationInput } from '../../../../../core/dto/pagination.request.dto';
import { CommentDocument } from '../../domain/comment.entity';
import { CommentResponseDto } from '../comment.response.dto';
import { PaginatedCommentResponseDto } from '../paginated-comment.response.dto';

export class CommentMapper {
  toResponseView(comment: CommentDocument): CommentResponseDto {
    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: comment.commentatorInfo,
      createdAt: comment.createdAt,
      likesInfo: comment.likesInfo,
    };
  }

  toResponsePaginatedView(
    comments: CommentDocument[],
    paginationInput: PaginationInput,
    totalCount: number,
  ): PaginatedCommentResponseDto {
    const pageNumber = paginationInput.pageNumber ?? 1;
    const pageSize = paginationInput.pageSize ?? 10;
    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: comments.map((comment) => this.toResponseView(comment)),
    };
  }
}

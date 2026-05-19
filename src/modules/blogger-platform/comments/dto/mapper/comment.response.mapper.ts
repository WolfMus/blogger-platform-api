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
    return {
      pagesCount: Math.ceil(totalCount / paginationInput.pageSize),
      page: paginationInput.pageNumber,
      pageSize: paginationInput.pageSize,
      totalCount: comments.length,
      items: comments.map((comment) => this.toResponseView(comment)),
    };
  }
}

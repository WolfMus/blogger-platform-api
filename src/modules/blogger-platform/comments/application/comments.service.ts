import { Injectable } from '@nestjs/common';
import { CommentResponseDto } from '../dto/comment.response.dto';
import { CommentsRepository } from '../infrastructure/comments.repository';
import { CommentMapper } from '../dto/mapper/comment.response.mapper';
import { PaginationInput } from '../../../../core/dto/pagination.request.dto';
import { PaginatedCommentResponseDto } from '../dto/paginated-comment.response.dto';

@Injectable()
export class CommentsService {
  constructor(
    private commentsRepo: CommentsRepository,
    private commentMapper: CommentMapper,
  ) {}

  async findById(id: string): Promise<CommentResponseDto> {
    const comment = await this.commentsRepo.findById(id);
    return this.commentMapper.toResponseView(comment);
  }

  async findAll(
    paginationInput: PaginationInput,
  ): Promise<PaginatedCommentResponseDto> {
    const { comments, totalCount } =
      await this.commentsRepo.findAll(paginationInput);
    return this.commentMapper.toResponsePaginatedView(
      comments,
      paginationInput,
      totalCount,
    );
  }

  async findAllForPost(
    paginationInput: PaginationInput,
    postId: string,
  ): Promise<PaginatedCommentResponseDto> {
    const { comments, totalCount } = await this.commentsRepo.findAllForPost(
      paginationInput,
      postId,
    );
    return this.commentMapper.toResponsePaginatedView(
      comments,
      paginationInput,
      totalCount,
    );
  }
}

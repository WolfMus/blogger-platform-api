import { HttpStatus, Injectable } from '@nestjs/common';
import { CommentResponseDto } from '../dto/comment.response.dto';
import { CommentsRepository } from '../infrastructure/comments.repository';
import { CommentMapper } from '../dto/mapper/comment.response.mapper';
import { PaginationInput } from '../../../../core/dto/pagination.request.dto';
import { PaginatedCommentResponseDto } from '../dto/paginated-comment.response.dto';
import {
  DomainException,
  Extension,
} from '../../../../core/exceptions/domain-exception';

@Injectable()
export class CommentsService {
  constructor(
    private commentsRepo: CommentsRepository,
    private commentMapper: CommentMapper,
  ) {}

  async findById(id: string): Promise<CommentResponseDto> {
    const comment = await this.commentsRepo.findById(id);
    if (!comment) {
      throw new DomainException({
        code: HttpStatus.NOT_FOUND,
        message: 'Not Found',
        extensions: [new Extension('Comment', 'Comment Not Found')],
      });
    }
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

  async delete(id: string): Promise<void> {
    return await this.commentsRepo.delete(id);
  }
}

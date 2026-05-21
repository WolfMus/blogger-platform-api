import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from '../domain/comment.entity';
import type { CommentModelType } from '../domain/comment.entity';
import {
  PaginationInput,
  SortDirection,
} from '../../../../core/dto/pagination.request.dto';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: CommentModelType,
  ) {}

  async findById(id: string): Promise<CommentDocument> {
    const comment = await this.CommentModel.findById(id);
    if (!comment) {
      throw new NotFoundException('id', 'Comment Not Found');
    }
    return comment;
  }

  async findAll(
    paginationInput: PaginationInput,
  ): Promise<{ comments: CommentDocument[]; totalCount: number }> {
    const sortBy = paginationInput.sortBy ?? 'createdAt';
    const sortDirection =
      paginationInput.sortDirection === SortDirection.Desc ? -1 : 1;
    const pageNumber = paginationInput.pageNumber ?? 1;
    const pageSize = paginationInput.pageSize ?? 10;
    const skip = (pageNumber - 1) * pageSize;

    const comments = await this.CommentModel.find()
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize);

    const totalCount = await this.CommentModel.countDocuments();

    return { comments, totalCount };
  }

  async findAllForPost(
    paginationInput: PaginationInput,
    postId: string,
  ): Promise<{ comments: CommentDocument[]; totalCount: number }> {
    const sortBy = paginationInput.sortBy ?? 'createdAt';
    const sortDirection =
      paginationInput.sortDirection === SortDirection.Desc ? -1 : 1;
    const pageNumber = paginationInput.pageNumber ?? 1;
    const pageSize = paginationInput.pageSize ?? 10;

    const skip = (pageNumber - 1) * pageSize;
    const comments = await this.CommentModel.find({ postId: postId })
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize);

    const totalCount = await this.CommentModel.countDocuments();

    return { comments, totalCount };
  }
}

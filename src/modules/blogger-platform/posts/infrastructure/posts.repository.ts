import { Injectable, NotFoundException, Post } from '@nestjs/common';
import { PostDocument } from '../domain/post.entity';
import type { PostModelType } from '../domain/post.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationInput } from '../../../../core/dto/pagination.dto';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
  ) {}

  async findAll(
    paginationInput: PaginationInput,
  ): Promise<{ posts: PostDocument[]; totalCount: number }> {
    const skip = (paginationInput.pageNumber - 1) * paginationInput.pageSize;

    const posts = await this.PostModel.find()
      .sort(paginationInput.sortDirection)
      .skip(skip)
      .limit(paginationInput.pageSize);

    const totalCount = await this.PostModel.countDocuments();

    return { posts, totalCount };
  }

  async findById(id: string): Promise<PostDocument> {
    const post = await this.PostModel.findById(id);
    if (!post) {
      throw new NotFoundException('id', 'Post Not Found');
    }
    return post;
  }

  async save(post: PostDocument): Promise<void> {
    await post.save();
    return;
  }

  async delete(id: string): Promise<void> {
    const deletedPost = await this.PostModel.findByIdAndDelete(id);
    if (deletedPost === null) {
      throw new NotFoundException('id', 'Post Not Found');
    }
    return;
  }
}

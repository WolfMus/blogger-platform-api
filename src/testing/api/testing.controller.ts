import { Controller, Delete } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../../modules/blogger-platform/blogs/domain/blog.entity';
import type { BlogModelType } from '../../modules/blogger-platform/blogs/domain/blog.entity';
import { Post } from '../../modules/blogger-platform/posts/domain/post.entity';
import type { PostModelType } from '../../modules/blogger-platform/posts/domain/post.entity';
import { Comment } from '../../modules/blogger-platform/comments/domain/comment.entity';
import type { CommentModelType } from '../../modules/blogger-platform/comments/domain/comment.entity';

@Controller('testing')
export class TestingController {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    @InjectModel(Comment.name)
    private CommentModel: CommentModelType,
  ) {}
  @Delete('/all-data')
  async deleteAllData(): Promise<void> {
    await this.BlogModel.deleteMany();
    await this.PostModel.deleteMany();
    await this.CommentModel.deleteMany();
    return;
  }
}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blogs/domain/blog.entity';
import { BlogsService } from './blogs/application/blogs.service';
import { BlogsController } from './blogs/api/blogs.controller';
import { BlogsRepository } from './blogs/infrastructure/blogs.repository';
import { BlogMapper } from './blogs/dto/mapper/blog.response.mapper';
import { PostsController } from './posts/api/posts.controller';
import { PostsService } from './posts/application/posts.service';
import { PostsRepository } from './posts/infrastructure/posts.repository';
import { PostsQueryRepository } from './posts/infrastructure/posts-query.repository';
import { Post, PostSchema } from './posts/domain/post.entity';
import { PostMapper } from './posts/dto/mapper/post.response.mapper';
import { CommentsController } from './comments/api/comments.controller';
import { CommentsService } from './comments/application/comments.service';
import { Comment, CommentSchema } from './comments/domain/comment.entity';
import { CommentsRepository } from './comments/infrastructure/comments.repository';
import { CommentMapper } from './comments/dto/mapper/comment.response.mapper';
import { CreateBlogUseCase } from './blogs/application/usecases/create-blog.usecase';

const blogUseCases = [CreateBlogUseCase];
const postUseCases = [];
const commentUseCases = [];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [BlogsController, PostsController, CommentsController],
  providers: [
    ...blogUseCases,
    BlogsService,
    BlogsRepository,
    BlogMapper,
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    PostMapper,
    CommentsService,
    CommentsRepository,
    CommentMapper,
    ...postUseCases,
    ...commentUseCases,
  ],
})
export class BloggerPlatformModule {}

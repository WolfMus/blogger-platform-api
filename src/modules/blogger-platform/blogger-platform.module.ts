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
import { PostsQwRepository } from './posts/infrastructure/posts-query.repository';
import { Post, PostSchema } from './posts/domain/post.entity';
import { PostMapper } from './posts/dto/mapper/post.response.mapper';
import { CommentsController } from './comments/api/comments.controller';
import { CommentsService } from './comments/application/comments.service';
import { Comment, CommentSchema } from './comments/domain/comment.entity';
import { CommentsRepository } from './comments/infrastructure/comments.repository';
import { CommentMapper } from './comments/dto/mapper/comment.response.mapper';
import { CreateBlogUseCase } from './blogs/application/usecases/create-blog.usecase';
import { UpdateBlogUseCase } from './blogs/application/usecases/update-blog.usecase';
import { DeleteBlogUseCase } from './blogs/application/usecases/delete-blog.usecase';
import { BlogsQwRepository } from './blogs/infrastructure/query/blogs-query.repository';
import { CreatePostUseCase } from './posts/application/usecases/create-post.usecase';
import { UpdatePostUseCase } from './posts/application/usecases/update-post.usecase';
import { DeletePostUseCase } from './posts/application/usecases/delete-post.usecase';
import { CreateCommentUseCase } from './comments/application/usecases/create-comment.usecase';
import { UpdateCommentUseCase } from './comments/application/usecases/update-comment.usecase';
import { ChangeLikeStatusUseCase } from './comments/application/usecases/change-like-status.usecase';

const blogUseCases = [CreateBlogUseCase, UpdateBlogUseCase, DeleteBlogUseCase];
const postUseCases = [CreatePostUseCase, UpdatePostUseCase, DeletePostUseCase];
const commentUseCases = [
  CreateCommentUseCase,
  UpdateCommentUseCase,
  ChangeLikeStatusUseCase,
];

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
    ...postUseCases,
    ...commentUseCases,
    BlogsService,
    BlogsRepository,
    BlogsQwRepository,
    BlogMapper,
    PostsService,
    PostsRepository,
    PostsQwRepository,
    PostMapper,
    CommentsService,
    CommentsRepository,
    CommentMapper,
  ],
})
export class BloggerPlatformModule {}

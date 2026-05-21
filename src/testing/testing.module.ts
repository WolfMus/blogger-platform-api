import { TestingController } from './api/testing.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Blog,
  BlogSchema,
} from '../modules/blogger-platform/blogs/domain/blog.entity';
import {
  Comment,
  CommentSchema,
} from '../modules/blogger-platform/comments/domain/comment.entity';
import {
  Post,
  PostSchema,
} from '../modules/blogger-platform/posts/domain/post.entity';
import { Module } from '@nestjs/common';
import { User, UserSchema } from '../modules/user-accounts/domain/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [TestingController],
})
export class TestingModule {}

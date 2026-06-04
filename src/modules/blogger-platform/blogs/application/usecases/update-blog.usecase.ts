import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { CreateBlogRequestDto } from '../../dto/create-blog.request.dto';

export class UpdateBlogCommand {
  constructor(
    public dto: CreateBlogRequestDto,
    public id: string,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(private blogsRepo: BlogsRepository) {}

  async execute(command: UpdateBlogCommand): Promise<void> {
    const blog = await this.blogsRepo.findById(command.id);
    blog.updateBlog(command.dto);
    await this.blogsRepo.save(blog);
    return;
  }
}

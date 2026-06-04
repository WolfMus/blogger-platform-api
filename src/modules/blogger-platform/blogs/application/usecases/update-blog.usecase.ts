import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { CreateBlogRequestDto } from '../../dto/create-blog.request.dto';

export class UpdateBlogCommand {
  constructor(
    public dto: CreateBlogRequestDto,
    id: string,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<CreateBlogRequestDto> {
  constructor(private blogsRepo: BlogsRepository) {}

  async execute(dto: CreateBlogRequestDto, id: string): Promise<void> {
    const blog = await this.blogsRepo.findById(id);
    blog.updateBlog(dto);
    await this.blogsRepo.save(blog);
    return;
  }
}
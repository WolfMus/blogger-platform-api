import { Injectable } from '@nestjs/common';
import { CreateBlogRequestDto } from '../dto/create-blog.request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../domain/blog.entity';
import type { BlogModelType } from '../domain/blog.entity';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { BlogMapper } from '../dto/mapper/blog.response.mapper';
import { PaginationInput } from '../../../../core/dto/pagination.dto';
import { PaginationResult } from '../../../../core/dto/pagination-result.dto';
import { BlogResponseDto } from '../dto/blog.response.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
    private blogsRepo: BlogsRepository,
    private blogsMapper: BlogMapper,
  ) {}

  async findOne(id: number): Promise<BlogResponseDto> {
    const blog = await this.blogsRepo.findOne(id);
    return this.blogsMapper.toResponseView(blog);
  }

  async findAll(paginationInput: PaginationInput): Promise<PaginationResult> {
    const { blogs, totalCount } = await this.blogsRepo.findAll(paginationInput);
    return this.blogsMapper.toResponsePaginatedView(
      blogs,
      paginationInput,
      totalCount,
    );
  }

  async create(dto: CreateBlogRequestDto): Promise<void> {
    const blog = this.BlogModel.createInstance(dto);
    await this.blogsRepo.save(blog);
    return;
  }

  async update(dto: CreateBlogRequestDto, id: number): Promise<void> {
    const blog = await this.blogsRepo.findOne(id);
    blog.updateBlog(dto);
    await this.blogsRepo.save(blog);
    return;
  }

  async delete(id: number): Promise<void> {
    return await this.blogsRepo.delete(id);
  }
}

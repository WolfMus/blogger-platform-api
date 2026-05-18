import { Injectable, NotFoundException } from '@nestjs/common';
import { Blog, BlogDocument } from '../domain/blog.entity';
import type { BlogModelType } from '../domain/blog.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationInput } from '../../../../core/dto/pagination.dto';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
  ) {}

  async findOne(id: number): Promise<BlogDocument> {
    const blog = await this.BlogModel.findById(id);
    if (!blog) {
      throw new NotFoundException('id', 'Blog not found');
    }
    return blog;
  }

  async findAll(
    paginationInput: PaginationInput,
  ): Promise<{ blogs: BlogDocument[]; totalCount: number }> {
    const skip = (paginationInput.pageNumber - 1) * paginationInput.pageSize;

    const blogs = await this.BlogModel.find()
      .sort(paginationInput.sortDirection)
      .skip(skip)
      .limit(paginationInput.pageSize);

    const totalCount = await this.BlogModel.countDocuments();

    return { blogs, totalCount };
  }

  async save(blog: BlogDocument): Promise<void> {
    await blog.save();
    return;
  }

  async delete(id: number): Promise<void> {
    const deletedBlog = await this.BlogModel.findByIdAndDelete(id);
    if (deletedBlog === null) {
      throw new NotFoundException('id', 'Blog not found');
    }
    return;
  }
}

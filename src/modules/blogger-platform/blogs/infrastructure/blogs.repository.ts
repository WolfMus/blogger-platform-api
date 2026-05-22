import { Injectable, NotFoundException } from '@nestjs/common';
import { Blog, BlogDocument } from '../domain/blog.entity';
import type { BlogModelType } from '../domain/blog.entity';
import { InjectModel } from '@nestjs/mongoose';
import { SortDirection } from '../../../../core/dto/pagination.request.dto';
import { BlogPaginationRequest } from '../dto/blog-pagination.request.dto';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
  ) {}

  async findById(id: string): Promise<BlogDocument> {
    const blog = await this.BlogModel.findById(id);
    if (!blog) {
      throw new NotFoundException('id', 'Blog not found');
    }
    return blog;
  }

  async findAll(
    paginationInput: BlogPaginationRequest,
  ): Promise<{ blogs: BlogDocument[]; totalCount: number }> {
    const sortBy = paginationInput.sortBy ?? 'createdAt';
    const sortDirection =
      paginationInput.sortDirection === SortDirection.Asc ? 1 : -1;
    const pageNumber = paginationInput.pageNumber ?? 1;
    const pageSize = paginationInput.pageSize ?? 10;
    const searchNameTerm = paginationInput.searchNameTerm ?? null;

    const filter: Record<string, any> = {};
    if (searchNameTerm) {
      filter.name = {
        $regex: searchNameTerm,
        $options: 'i',
      };
    }

    const skip = (pageNumber - 1) * pageSize;
    const blogs = await this.BlogModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize);

    const totalCount = await this.BlogModel.countDocuments(filter);

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

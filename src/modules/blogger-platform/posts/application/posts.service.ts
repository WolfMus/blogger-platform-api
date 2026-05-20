import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, type PostModelType } from '../domain/post.entity';
import {
  CreatePostForBlogRequestDto,
  CreatePostRequestDto,
} from '../dto/create-post.request.dto';
import { PostsRepository } from '../infrastructure/posts.repository';
import { PostMapper } from '../dto/mapper/post.response.mapper';
import { PostResponseDto } from '../dto/post.response.dto';
import { PaginationInput } from '../../../../core/dto/pagination.request.dto';
import { PaginatedPostResponseDto } from '../dto/post-paginated-view.response.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    private postsRepo: PostsRepository,
    private postMapper: PostMapper,
  ) {}

  async findAll(
    paginationInput: PaginationInput,
  ): Promise<PaginatedPostResponseDto> {
    const { posts, totalCount } = await this.postsRepo.findAll(paginationInput);
    return this.postMapper.toResponsePaginatedView(
      posts,
      totalCount,
      paginationInput,
    );
  }

  async findAllByBlogId(
    paginationInput: PaginationInput,
    blogId: string,
  ): Promise<PaginatedPostResponseDto> {
    const { posts, totalCount } = await this.postsRepo.findAllByBlogId(
      paginationInput,
      blogId,
    );
    return this.postMapper.toResponsePaginatedView(
      posts,
      totalCount,
      paginationInput,
    );
  }

  async findOne(id: string): Promise<PostResponseDto> {
    const post = await this.postsRepo.findById(id);
    return this.postMapper.toResponseView(post);
  }

  async create(
    dto: CreatePostRequestDto,
    blogName: string,
  ): Promise<PostResponseDto> {
    const post = this.PostModel.createInstance(dto, blogName);
    await this.postsRepo.save(post);
    return this.postMapper.toResponseView(post);
  }

  async createForBlog(
    dto: CreatePostForBlogRequestDto,
    blogId: string,
    blogName: string,
  ): Promise<PostResponseDto> {
    const postData: CreatePostRequestDto = {
      ...dto,
      blogId,
    };
    const post = this.PostModel.createInstance(postData, blogName);
    await this.postsRepo.save(post);
    return this.postMapper.toResponseView(post);
  }

  async update(id: string, dto: CreatePostRequestDto): Promise<void> {
    const post = await this.postsRepo.findById(id);
    post.updatePost(dto);
    return await this.postsRepo.save(post);
  }

  async delete(id: string): Promise<void> {
    return this.postsRepo.delete(id);
  }
}

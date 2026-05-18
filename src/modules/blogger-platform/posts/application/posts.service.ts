import { Injectable, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { PostModelType } from '../domain/post.entity';
import { CreatePostRequestDto } from '../dto/create-post.request.dto';
import { PostsRepository } from '../infrastructure/posts.repository';
import { PostMapper } from '../dto/mapper/post.response.mapper';
import { PostResponseDto } from '../dto/post.response.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    private postsRepo: PostsRepository,
    private postMapper: PostMapper,
  ) {}

  async findOne(id: string): Promise<PostResponseDto> {
    const post = await this.postsRepo.findById(id);
    return this.postMapper.toReponseView(post);
  }

  async create(dto: CreatePostRequestDto): Promise<PostResponseDto> {
    const post = this.PostModel.createInstance(dto);
    await this.postsRepo.save(post);
    return this.postMapper.toReponseView(post);
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

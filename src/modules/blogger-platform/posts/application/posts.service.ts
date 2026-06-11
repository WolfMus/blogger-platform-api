import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LikeStatus, Post, type PostModelType } from '../domain/post.entity';
import {
  CreatePostForBlogRequestDto,
  CreatePostRequestDto,
} from '../dto/create-post.request.dto';
import { PostsRepository } from '../infrastructure/posts.repository';
import { PostMapper } from '../dto/mapper/post.response.mapper';
import { PostResponseDto } from '../dto/post.response.dto';
import { PaginationInput } from '../../../../core/dto/pagination.request.dto';
import { PaginatedPostResponseDto } from '../dto/post-paginated-view.response.dto';
import { PostsQwRepository } from '../infrastructure/posts-query.repository';
import {
  DomainException,
  Extension,
} from '../../../../core/exceptions/domain-exception';
import { LikesRepository } from '../../likes/infrastructure/likes.repository';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    private postsRepo: PostsRepository,
    private postsQueryRepo: PostsQwRepository,
    private postMapper: PostMapper,
    private likesRepo: LikesRepository,
  ) {}

  async findAll(
    paginationInput: PaginationInput,
    userId: string | null,
  ): Promise<PaginatedPostResponseDto> {
    const { posts, totalCount } =
      await this.postsQueryRepo.findAll(paginationInput);

    if (!userId) {
      return this.postMapper.toResponsePaginatedView(
        posts,
        paginationInput,
        totalCount,
      );
    }
    const postsIds = posts.map((post) => {
      return post._id.toString();
    });
    const statuses = await this.likesRepo.findEntityIdAndLikeStatus(
      postsIds,
      userId,
    );
    if (!statuses) {
      return this.postMapper.toResponsePaginatedView(
        posts,
        paginationInput,
        totalCount,
      );
    }
    const statusMap: Record<string, LikeStatus> = Object.fromEntries(statuses);
    return this.postMapper.toResponsePaginatedView(
      posts,
      paginationInput,
      totalCount,
      statusMap,
    );
  }

  async findAllByBlogId(
    paginationInput: PaginationInput,
    blogId: string,
  ): Promise<PaginatedPostResponseDto> {
    const { posts, totalCount } = await this.postsQueryRepo.findAllByBlogId(
      paginationInput,
      blogId,
    );
    return this.postMapper.toResponsePaginatedView(
      posts,
      paginationInput,
      totalCount,
    );
  }

  async findById(id: string, userId: string | null): Promise<PostResponseDto> {
    const post = await this.postsRepo.findById(id);
    if (!post) {
      throw new DomainException({
        code: HttpStatus.NOT_FOUND,
        message: 'Not Found',
        extensions: [new Extension('Post Not Found', 'id')],
      });
    }
    if (!userId) return this.postMapper.toResponseView(post);
    const like = await this.likesRepo.findByEntityIdAndUserId(id, userId);
    if (!like) {
      throw new DomainException({
        code: HttpStatus.NOT_FOUND,
        message: 'Not Found',
        extensions: [new Extension('like and user id', 'Like Not Found')],
      });
    }
    return this.postMapper.toResponseView(post, like.likeStatus);
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
}

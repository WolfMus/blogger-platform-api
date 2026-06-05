import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePostRequestDto } from '../dto/create-post.request.dto';
import { PostsService } from '../application/posts.service';
import { PostResponseDto } from '../dto/post.response.dto';
import { PaginationInput } from '../../../../core/dto/pagination.request.dto';
import { PaginatedPostResponseDto } from '../dto/post-paginated-view.response.dto';
import { PaginatedCommentResponseDto } from '../../comments/dto/paginated-comment.response.dto';
import { CommentsService } from '../../comments/application/comments.service';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePostCommand } from '../application/usecases/create-post.usecase';
import { UpdatePostCommand } from '../application/usecases/update-post.usecase';
import { DeletePostCommand } from '../application/usecases/delete-post.usecase';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(
    private commandBus: CommandBus,
    private postsService: PostsService,
    private commentsService: CommentsService,
  ) {}

  // CREATE POST
  @ApiOperation({ summary: 'Returns created post' })
  @ApiOkResponse({ type: PostResponseDto, description: 'Post created' })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createPost(
    @Body() dto: CreatePostRequestDto,
  ): Promise<PostResponseDto> {
    return this.commandBus.execute<CreatePostCommand, PostResponseDto>(
      new CreatePostCommand(dto),
    );
  }

  // FIND POST BY ID
  @ApiOperation({ summary: 'Return blog by id' })
  @ApiOkResponse({ type: PostResponseDto, description: 'Success' })
  @ApiNotFoundResponse({ description: 'Post Not Found' })
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async getPost(@Param('id') id: string): Promise<PostResponseDto> {
    return await this.postsService.findById(id);
  }

  // FIND ALL POSTS WITH PAGINATION
  @ApiOperation({ summary: 'Returns posts with pagination' })
  @ApiOkResponse({
    type: PaginatedPostResponseDto,
    description: 'Success',
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllPosts(
    @Query() paginationInput: PaginationInput,
  ): Promise<PaginatedPostResponseDto> {
    const posts = await this.postsService.findAll(paginationInput);
    return posts;
  }

  // UPDATE POST BY ID
  @ApiOperation({ summary: 'Update blog by id' })
  @ApiNoContentResponse({ description: 'No Content' })
  @ApiNotFoundResponse({ description: 'Post Not Found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put('/:id')
  async updatePost(
    @Param('id') id: string,
    @Body() dto: CreatePostRequestDto,
  ): Promise<void> {
    return this.commandBus.execute<UpdatePostCommand, void>(
      new UpdatePostCommand(dto, id),
    );
  }

  // DELETE POST
  @ApiOperation({ summary: 'Delete post by id' })
  @ApiNoContentResponse({ description: 'No content' })
  @ApiNotFoundResponse({ description: 'Post Not Found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  async deletePost(@Param('id') id: string): Promise<void> {
    return this.commandBus.execute<DeletePostCommand, void>(
      new DeletePostCommand(id),
    );
  }

  // ======== COMMENTS ========
  // GET ALL COMMENTS BY POSTID
  @ApiOperation({
    summary: 'Returns all comments for specific post with pagination',
  })
  @ApiOkResponse({
    type: PaginatedCommentResponseDto,
    description: 'Success',
  })
  @HttpCode(HttpStatus.OK)
  @Get('/:id/comments')
  async getAllForPost(
    @Query() paginationInput: PaginationInput,
    @Param('id', ParseIntPipe) id: string,
  ): Promise<PaginatedCommentResponseDto> {
    return await this.commentsService.findAllForPost(paginationInput, id);
  }
}

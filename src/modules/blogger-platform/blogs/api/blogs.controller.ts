import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateBlogRequestDto } from '../dto/create-blog.request.dto';
import { BlogsService } from '../application/blogs.service';
import { PaginationInput } from '../../../../core/dto/pagination.request.dto';
import { BlogResponseDto } from '../dto/blog-response.dto';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PostsService } from '../../posts/application/posts.service';
import { PaginatedBlogResponseDto } from '../dto/blog-paginated-view.response.dto';
import { PaginatedPostResponseDto } from '../../posts/dto/post-paginated-view.response.dto';
import { PostResponseDto } from '../../posts/dto/post.response.dto';
import { CreatePostForBlogRequestDto } from '../../posts/dto/create-post.request.dto';
import { BlogPaginationRequest } from '../dto/blog-pagination.request.dto';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { CreateBlogCommand } from '../application/usecases/create-blog.usecase';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateBlogCommand } from '../application/usecases/update-blog.usecase';
import { DeleteBlogCommand } from '../application/usecases/delete-blog.usecase';
import { CreatePostCommand } from '../../posts/application/usecases/create-post.usecase';

@ApiTags('Blogs')
@Controller('blogs')
export class BlogsController {
  constructor(
    private commandBus: CommandBus,
    private blogsService: BlogsService,
    private postsService: PostsService,
  ) {}

  // ✅ GET BLOG BY ID
  @ApiOperation({ summary: 'Returns blog by id' })
  @ApiOkResponse({ type: BlogResponseDto, description: 'Returns blog' })
  @ApiNotFoundResponse({ description: 'Blog not found' })
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async getOneBlog(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<BlogResponseDto> {
    return await this.blogsService.findById(id);
  }

  // ✅ GET BLOGS WITH PAGINATION
  @ApiOperation({ summary: 'Returns blogs with pagination' })
  @ApiOkResponse({ type: PaginatedBlogResponseDto, description: 'Success' })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllBlogs(
    @Query() paginationInput: BlogPaginationRequest,
  ): Promise<PaginatedBlogResponseDto> {
    const blogs = await this.blogsService.findAll(paginationInput);
    return blogs;
  }

  // ✅ CREATE NEW BLOG
  @ApiOperation({ summary: 'Create new blog' })
  @ApiOkResponse({ description: 'New blog created' })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createBlog(
    @Body() dto: CreateBlogRequestDto,
  ): Promise<BlogResponseDto> {
    return await this.commandBus.execute<CreateBlogCommand, BlogResponseDto>(
      new CreateBlogCommand(dto),
    );
  }

  // ✅ UPDATE BLOG BY ID
  @ApiOperation({ summary: 'Update existing blog by id with InputModel' })
  @ApiOkResponse({ description: 'No Content' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put('/:id')
  async updateBlog(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: CreateBlogRequestDto,
  ): Promise<void> {
    return await this.commandBus.execute<UpdateBlogCommand, void>(
      new UpdateBlogCommand(dto, id),
    );
  }

  // ✅ DELETE BLOG BY ID
  @ApiOperation({ summary: 'Delete blog by id' })
  @ApiOkResponse({ description: 'No Content' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  async deleteBlog(@Param('id', ParseObjectIdPipe) id: number): Promise<void> {
    return await this.commandBus.execute<DeleteBlogCommand, void>(
      new DeleteBlogCommand(id),
    );
  }

  // ======== POSTS ========
  // GET ALL POSTS BY BLOG ID WITH PAGINATION
  @ApiOperation({ summary: 'Returns all posts for specific blog' })
  @ApiOkResponse({
    type: PaginatedPostResponseDto,
    description: 'Success',
  })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get('/:id/posts')
  async getAllPostsByBlogId(
    @Query() paginationInput: PaginationInput,
    @Param('id', ParseObjectIdPipe) blogId: string,
  ): Promise<PaginatedPostResponseDto> {
    await this.blogsService.findById(blogId);
    const posts = await this.postsService.findAllByBlogId(
      paginationInput,
      blogId,
    );
    return posts;
  }

  // CREATE NEW POST FOR SPECIFIED BLOG
  @ApiOperation({ summary: 'Creates new post for specific blog' })
  @ApiCreatedResponse({
    type: PostResponseDto,
    description: 'New post for specific blog was created',
  })
  @ApiNotFoundResponse({
    description: 'Blog Not Found',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/:id/posts')
  async createPostByBlogId(
    @Param('id', ParseObjectIdPipe) blogId: string,
    @Body() dto: CreatePostForBlogRequestDto,
  ): Promise<PostResponseDto> {
    return await this.commandBus.execute<CreatePostCommand, PostResponseDto>(
      new CreatePostCommand({
        ...dto,
        blogId,
      }),
    );
  }
}

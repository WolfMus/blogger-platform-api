import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateBlogRequestDto } from '../dto/create-blog.request.dto';
import { BlogsService } from '../application/blogs.service';
import { PaginationInput } from '../../../../core/dto/pagination.dto';
import { PaginationResult } from '../../../../core/dto/pagination-result.dto';
import { BlogResponseDto } from '../dto/blog.response.dto';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Blogs')
@Controller('blogs')
export class BlogsController {
  constructor(private blogsService: BlogsService) {}

  // GET BLOG BY ID
  @ApiOperation({ summary: 'Returns blog by id' })
  @ApiOkResponse({ type: BlogResponseDto, description: 'Returns blog' })
  @ApiNotFoundResponse({ description: 'Blog not found' })
  @Get('/:id')
  async getOneBlog(@Param('id') id: number): Promise<BlogResponseDto> {
    return await this.blogsService.findOne(id);
  }

  // GET BLOGS WITH PAGINATION
  @ApiOperation({ summary: 'Returns blogs with pagination' })
  @ApiOkResponse({ type: PaginationResult, description: 'Success' })
  @Get()
  async getAllBlogs(
    @Query() paginationInput: PaginationInput,
  ): Promise<PaginationResult<BlogResponseDto>> {
    const blogs = await this.blogsService.findAll(paginationInput);
    return blogs;
  }

  // CREATE NEW BLOG
  @ApiOperation({ summary: 'Create new blog' })
  @ApiOkResponse({ description: 'New blog created' })
  @Post()
  async createBlog(@Body() dto: CreateBlogRequestDto): Promise<void> {
    return await this.blogsService.create(dto);
  }

  // UPDATE BLOG BY ID
  @ApiOperation({ summary: 'Update existing blog by id with InputModel' })
  @ApiOkResponse({ description: 'No Content' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Put('/:id')
  async updateBlog(
    @Param('id') id: number,
    @Body() dto: CreateBlogRequestDto,
  ): Promise<void> {
    return await this.blogsService.update(dto, id);
  }

  // DELETE BLOG BY ID
  @ApiOperation({ summary: 'Delete blog by id' })
  @ApiOkResponse({ description: 'No Content' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Delete('/:id')
  async deleteBlog(@Param('id') id: number): Promise<void> {
    return await this.blogsService.delete(id);
  }

  // ======== POSTS ========
  // GET ALL POSTS BY BLOG ID WITH PAGINATION
  // @Get('/:id')
  // async getAllPostsByBlogId(@Param('id') blogId: string): void {
  //   return;
  // }

  // CREATE NEW POST FOR SPECIFIED BLOG
}

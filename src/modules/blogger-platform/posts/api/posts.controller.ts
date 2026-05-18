import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  // CREATE POST
  @ApiOperation({ summary: 'Returns created post' })
  @ApiOkResponse({ type: PostResponseDto, description: 'Post created' })
  @Post()
  async createPost(
    @Body() dto: CreatePostRequestDto,
  ): Promise<PostResponseDto> {
    return await this.postsService.create(dto);
  }

  // FIND POST BY ID
  @ApiOperation({ summary: 'Return blog by id' })
  @ApiOkResponse({ type: PostResponseDto, description: 'Success' })
  @ApiNotFoundResponse({ description: 'Post Not Found' })
  @Get('/:id')
  async getPost(@Param('id') id: string): Promise<PostResponseDto> {
    return await this.postsService.findOne(id);
  }

  // UPDATE POST BY ID
  @ApiOperation({ summary: 'Update blog by id' })
  @ApiNoContentResponse({ description: 'No Content' })
  @ApiNotFoundResponse({ description: 'Post Not Found' })
  @Put('/:id')
  async updatePost(
    @Param('id') id: string,
    @Body() dto: CreatePostRequestDto,
  ): Promise<void> {
    await this.postsService.update(id, dto);
    return;
  }

  // DELETE POST
  @ApiOperation({ summary: 'Delete post by id' })
  @ApiNoContentResponse({ description: 'No content' })
  @ApiNotFoundResponse({ description: 'Post Not Found' })
  @Delete('/:id')
  async deletePost(@Param('id') id: string): Promise<void> {
    return await this.postsService.delete(id);
  }
}

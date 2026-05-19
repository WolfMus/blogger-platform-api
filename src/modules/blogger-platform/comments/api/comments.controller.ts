import { Controller, Get, Param } from '@nestjs/common';
import { CommentResponseDto } from '../dto/comment.response.dto';
import { CommentsService } from '../application/comments.service';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @ApiOperation({ summary: 'Returns comment by id' })
  @ApiOkResponse({ type: CommentResponseDto, description: 'Success' })
  @ApiNotFoundResponse({ description: 'Comment Not Found' })
  @Get('/:id')
  async getOne(@Param('id') id: string): Promise<CommentResponseDto> {
    return await this.commentsService.findById(id);
  }
}

import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
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
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async getOne(
    @Param('id', ParseIntPipe) id: string,
  ): Promise<CommentResponseDto> {
    return await this.commentsService.findById(id);
  }
}

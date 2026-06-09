import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CommentResponseDto } from '../dto/comment.response.dto';
import { CommentsService } from '../application/comments.service';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { JwtStrategy } from '../../../user-accounts/guards/jwt.strategy';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  // FIND COMMENT BY ID
  @ApiOperation({ summary: 'Returns comment by id' })
  @ApiOkResponse({ type: CommentResponseDto, description: 'Success' })
  @ApiNotFoundResponse({ description: 'Comment Not Found' })
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async getOne(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<CommentResponseDto> {
    return await this.commentsService.findById(id);
  }

  // DELETE COMMENT
  @ApiOperation({ summary: 'Delete comment by id' })
  @ApiOkResponse({ description: 'No Content' })
  @ApiNotFoundResponse({ description: 'Comment Not Found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtStrategy)
  @Delete('/:id')
  async delete(@Param('id', ParseObjectIdPipe) id: string): Promise<void> {
    return await this.commentsService.delete(id);
  }
}

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
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentResponseDto } from '../dto/comment.response.dto';
import { CommentsService } from '../application/comments.service';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { JwtAuthGuard } from '../../../user-accounts/guards/bearer/jwt-auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateCommentCommand } from '../application/usecases/update-comment.usecase';
import type { Request } from 'express';
import { LikeStatus } from '../../posts/domain/post.entity';
import { LikeCommentCommand } from '../application/usecases/change-like-status.usecase';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(
    private commentsService: CommentsService,
    private commandBus: CommandBus,
  ) {}

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

  // UPDATE COMMENT
  @ApiOperation({ summary: 'Update comment by id' })
  @ApiOkResponse({ description: 'No Content' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({
    description: 'If try edit the comment that is not your own',
  })
  @ApiNotFoundResponse({ description: 'Comment Not Found' })
  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async update(
    @Req() req: Request,
    @Param('id', ParseObjectIdPipe) id: string,
    @Body('content') content: string,
  ): Promise<void> {
    const userInfo = req.user as { userId: string; login: string };
    return await this.commandBus.execute<UpdateCommentCommand, void>(
      new UpdateCommentCommand(id, content, userInfo),
    );
  }

  // DELETE COMMENT
  @ApiOperation({ summary: 'Delete comment by id' })
  @ApiOkResponse({ description: 'No Content' })
  @ApiNotFoundResponse({ description: 'Comment Not Found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async delete(@Param('id', ParseObjectIdPipe) id: string): Promise<void> {
    return await this.commentsService.delete(id);
  }

  // LIKE/DISLIKE COMMMENT
  @UseGuards(JwtAuthGuard)
  @Post('/:id/like-status')
  async changeLikeStatus(
    @Req() req: Request,
    @Param('id', ParseObjectIdPipe) id: string,
    @Body('likeStatus') likeStatus: LikeStatus,
  ): Promise<void> {
    const userInfo = req.user as { userId: string; login: string };
    return await this.commandBus.execute<LikeCommentCommand, void>(
      new LikeCommentCommand(id, likeStatus, userInfo),
    );
  }
}

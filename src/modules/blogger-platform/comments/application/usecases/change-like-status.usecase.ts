import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeStatus } from '../../../posts/domain/post.entity';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { DomainException, Extension } from '../../../../../core/exceptions/domain-exception';
import { HttpStatus } from '@nestjs/common';

export class ChangeLikeStatusCommand {
  constructor(
    public id: string,
    public likeStatus: LikeStatus,
    public userInfo: { userId: string; login: string },
  ) {}
}

@CommandHandler(ChangeLikeStatusCommand)
export class ChangeLikeStatusUseCase implements ICommandHandler<
  ChangeLikeStatusCommand,
  void
> {
  constructor(private commentRepo: CommentsRepository) {}
  async execute(command: ChangeLikeStatusCommand): Promise<void> {
    /**
     * Поиск комментария
     * Поиск лайка
     * Обновляю\Создаю лайк
     * Обновление счетчиков (через репозиторий)
     * Сохранение
     */
    const comment = await this.commentRepo.findById(id);
    if (!comment) {
      throw new DomainException({
        code: HttpStatus.NOT_FOUND,
        message: 'Not Found',
        extensions: [new Extension('id', 'Comment Not Found')],
      });
    }
    comment.changeCountStatus(command.likeStatus);
    return;
  }
}

import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentEntityDto {
  @ApiProperty()
  content: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  userLogin: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class CreatePostForBlogRequestDto {
  @ApiProperty({})
  title: string;

  @ApiProperty({})
  shortDescription: string;

  @ApiProperty({})
  content: string;
}

export class CreatePostRequestDto {
  @ApiProperty({})
  title: string;

  @ApiProperty({})
  shortDescription: string;

  @ApiProperty({})
  content: string;

  @ApiProperty({})
  blogId: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreatePostForBlogRequestDto {
  @ApiProperty({})
  @IsString()
  @Length(3, 30)
  title: string;

  @ApiProperty({})
  @Length(1, 100)
  shortDescription: string;

  @ApiProperty({})
  @Length(1, 1000)
  content: string;
}

export class CreatePostRequestDto {
  @ApiProperty({})
  @IsString()
  @Length(3, 30)
  title: string;

  @ApiProperty({})
  @Length(1, 100)
  shortDescription: string;

  @ApiProperty({})
  @Length(1, 1000)
  content: string;

  @ApiProperty({})
  @IsString()
  blogId: string;
}

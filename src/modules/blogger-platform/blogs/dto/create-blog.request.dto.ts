import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

const emailRegExp =
  '^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$';

@ApiSchema({
  name: 'CreateBlogRequestDto',
})
export class CreateBlogRequestDto {
  @ApiProperty({})
  @Length(4, 15)
  @IsString()
  name: string;

  @ApiProperty({})
  @Length(1, 500)
  description: string;

  @ApiProperty({})
  @Matches(emailRegExp)
  @Length(5, 100)
  websiteUrl: string;
}

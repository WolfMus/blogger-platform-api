import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

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
  @IsEmail()
  @Length(5, 100)
  websiteUrl: string;
}

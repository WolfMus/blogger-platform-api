import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  name: 'CreateBlogRequestDto',
})
export class CreateBlogRequestDto {
  @ApiProperty({})
  name: string;

  @ApiProperty({})
  description: string;

  @ApiProperty({})
  websiteUrl: string;
}

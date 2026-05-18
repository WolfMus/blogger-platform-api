import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: 'BlogResponseDto' })
export class BlogResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  websiteUrl: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  isMembership: boolean;
}

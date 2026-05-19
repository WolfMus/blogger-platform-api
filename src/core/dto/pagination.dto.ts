import { ApiProperty } from '@nestjs/swagger';

export class Pagination {
  @ApiProperty({})
  pagesCount: number;

  @ApiProperty({})
  page: number;

  @ApiProperty({})
  pageSize: number;

  @ApiProperty({})
  totalCount: number;
}

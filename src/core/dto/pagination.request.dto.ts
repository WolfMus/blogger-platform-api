import { ApiProperty } from '@nestjs/swagger';

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export class PaginationInput {
  @ApiProperty()
  searchNameTerm: string | null = null;
  @ApiProperty()
  sortBy: string = 'createdAt';
  @ApiProperty()
  sortDirection: SortDirection = SortDirection.Desc;
  @ApiProperty()
  pageNumber: number = 1;
  @ApiProperty()
  pageSize: number = 10;
}

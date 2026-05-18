export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export class PaginationInput {
  searchNameTerm: string;
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
}

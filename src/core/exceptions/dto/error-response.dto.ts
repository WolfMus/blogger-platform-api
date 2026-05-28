export class ErrorItemResponseDto {
  field: string;
  message: string;
}

export class ErrorResponseDto {
  errors: ErrorItemResponseDto[];
}

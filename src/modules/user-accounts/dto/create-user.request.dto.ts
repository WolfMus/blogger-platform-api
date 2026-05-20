import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRequestDto {
  @ApiProperty()
  login: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  email: string;
}

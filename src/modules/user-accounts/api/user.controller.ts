import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { CreateUserRequestDto } from '../dto/create-user.request.dto';
import { UserResponseDto } from '../dto/user.response.dto';
import { UserService } from '../application/user.service';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Add new user to the system' })
  @ApiCreatedResponse({
    type: UserResponseDto,
    description: 'Returns newly created user',
  })
  @Post()
  async createUser(
    @Body() dto: CreateUserRequestDto,
  ): Promise<UserResponseDto> {
    return await this.userService.create(dto);
  }

  @ApiOperation({ summary: 'Delete user from DB by id' })
  @ApiNoContentResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'User Not Found' })
  @Delete('/:id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    return await this.userService.delete(id);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserRequestDto } from '../dto/create-user.request.dto';
import { UserResponseDto } from '../dto/user.response.dto';
import { UserService } from '../application/user.service';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { PaginationInput } from '../../../core/dto/pagination.request.dto';
import { PaginatedUserResponseDto } from '../dto/post-paginated-view.response.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  // GET ALL USERS
  @ApiOperation({ summary: 'Returns all users with pagination' })
  @ApiOkResponse({ type: PaginatedUserResponseDto, description: 'Success' })
  @Get()
  async findAll(
    @Query() pagination: PaginationInput,
  ): Promise<PaginatedUserResponseDto> {
    return await this.userService.findAll(pagination);
  }

  // CREATE USER
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

  // DELETE USER
  @ApiOperation({ summary: 'Delete user from DB by id' })
  @ApiNoContentResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'User Not Found' })
  @Delete('/:id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    return await this.userService.delete(id);
  }
}

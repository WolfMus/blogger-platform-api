import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserRequestDto } from '../dto/create-user.request.dto';
import { UserService } from '../application/user.service';

@Controller('auth')
export class AuthController {
  constructor(private userService: UserService) {}
  // REGISTRATION
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/registration')
  async registration(@Body() dto: CreateUserRequestDto): Promise<void> {
    return this.userService.registerUser(dto);
  }

  // REGISTRATION-CONFIRMATION
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/registration-confirmation')
  async confirmRegistration(@Body('code') code: string): Promise<void> {
    return this.userService.confirmRegistration(code);
  }
}

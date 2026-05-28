import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserRequestDto } from '../dto/input/create-user.request.dto';
import { UserService } from '../application/user.service';
import { NewPasswordDto } from '../dto/input/new-password.dto';
import { LoginUserRequestDto } from '../dto/input/login-user.request.dto';
import { AuthService } from '../application/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  // LOGIN
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async loginUser(
    @Body() dto: LoginUserRequestDto,
  ): Promise<{ accessToken: string }> {
    // ): Promise<> {
    return await this.authService.login(dto);
  }

  // REGISTRATION
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/registration')
  async registration(@Body() dto: CreateUserRequestDto): Promise<void> {
    return await this.userService.registerUser(dto);
  }

  // REGISTRATION-CONFIRMATION
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/registration-confirmation')
  async confirmRegistration(@Body('code') code: string): Promise<void> {
    return await this.userService.confirmRegistration(code);
  }

  // REGISTRATION EMAIL RESENDING
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/registration-email-resending')
  async resendConfirmationCode(@Body('email') email: string): Promise<void> {
    return await this.userService.resendConfirmationCode(email);
  }

  // RECOVERY CODE PASSWORD
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/password-recovery')
  async passwordRecovery(@Body('email') email: string): Promise<void> {
    return await this.userService.recoveryPassword(email);
  }

  // NEW PASSWORD
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/new-password')
  async newPassword(@Body() newPasswordDto: NewPasswordDto): Promise<void> {
    return await this.userService.newPassword(newPasswordDto);
  }
}

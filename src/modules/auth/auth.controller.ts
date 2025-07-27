import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() data: SignUpDto): Promise<{ message: string }> {
    return this.authService.signup(data);
  }

  @Post('login')
  async login(
    @Body() data: LoginDto,
  ): Promise<{ message: string; token: string }> {
    return this.authService.login(data);
  }
}

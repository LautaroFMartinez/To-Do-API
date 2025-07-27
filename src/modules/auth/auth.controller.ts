import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates a new user account with email and password',
  })
  @ApiBody({ type: SignUpDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'User created successfully',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'array', items: { type: 'string' } },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiConflictResponse({
    description: 'Email already exists',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: { type: 'string', example: 'Email already exists' },
        error: { type: 'string', example: 'Conflict' },
      },
    },
  })
  async signup(@Body() data: SignUpDto): Promise<{ message: string }> {
    return this.authService.signup(data);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login user',
    description: 'Authenticates user and returns JWT token',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Login successful',
        },
        token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Invalid credentials' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  async login(
    @Body() data: LoginDto,
  ): Promise<{ message: string; token: string }> {
    return this.authService.login(data);
  }
}

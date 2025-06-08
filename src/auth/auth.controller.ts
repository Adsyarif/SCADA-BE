import { Controller, Post, UseGuards, Request, Get, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './decorators/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and return JWT' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Successful login, returns access_token',
    schema: {
      properties: {
        access_token: { type: 'string', example: 'eyJhbGciOiJI…' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() LoginDto: LoginDto ) {
    const user = await this.authService.validateUser(LoginDto.email, LoginDto.password)
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth('access_token')
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile',
    schema: {
      properties: {
        id:       { type: 'string', example: 'uuid-1234' },
        username: { type: 'string', example: 'alice' },
        email:    { type: 'string', example: 'alice@example.com' },
        role:     { type: 'string', example: 'admin' },
        perms:    {
          type: 'array',
          items: { type: 'string' },
          example: ['read:post','create:comment'],
        },
      },
    },
  })
  
  getProfile(@Request() req) {
    return this.authService.me(req.user.userId);
  }
}

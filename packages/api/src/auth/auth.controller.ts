import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  User,
  ApiResponse as ApiResponseType,
} from '@aipackr/types';

export class RegisterDto {
  email: string;
  password: string;
  name: string;
}

export class LoginDto {
  email: string;
  password: string;
}

export class RefreshTokenDto {
  refreshToken: string;
}

export class LogoutDto {
  refreshToken: string;
}

export class ForgotPasswordDto {
  email: string;
}

export class ResetPasswordDto {
  token: string;
  newPassword: string;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Registration failed - invalid data or user already exists',
  })
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<ApiResponseType<{ user: User; accessToken: string }>> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate user and get access token' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: Object,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<ApiResponseType<{ user: User; accessToken: string }>> {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: Object,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid refresh token',
  })
  async refresh(
    @Body() refreshDto: RefreshTokenDto,
  ): Promise<ApiResponseType<{ accessToken: string }>> {
    return this.authService.refresh(refreshDto.refreshToken);
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user and invalidate tokens' })
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
  })
  async logout(
    @Body() logoutDto: LogoutDto,
  ): Promise<ApiResponseType<null>> {
    return this.authService.logout(logoutDto.refreshToken);
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
    type: Object,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
  })
  async getProfile(@Request() req: any): Promise<ApiResponseType<User>> {
    return this.authService.getProfile(req.user?.id);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent',
  })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ApiResponseType<null>> {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired reset token',
  })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<ApiResponseType<null>> {
    return this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword);
  }
}
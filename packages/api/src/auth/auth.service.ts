import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import {
  User,
  UserPreferences,
  BagSize,
  ApiResponse,
} from '@aipackr/types';
import { RegisterDto, LoginDto } from './auth.controller';

@Injectable()
export class AuthService {
  private users: (User & { password: string })[] = [];
  private refreshTokens: Map<string, string> = new Map(); // refreshToken -> userId

  async register(registerDto: RegisterDto): Promise<ApiResponse<{ user: User; accessToken: string }>> {
    // Check if user already exists
    const existingUser = this.users.find(u => u.email === registerDto.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Create new user
    const newUser: User & { password: string } = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: registerDto.email,
      name: registerDto.name,
      password: registerDto.password, // In real app, hash the password
      preferences: {
        defaultBagSize: BagSize.CARRY_ON,
        stylePreferences: [],
        allergies: [],
        dietaryRestrictions: [],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(newUser);

    const { password, ...userWithoutPassword } = newUser;
    const accessToken = this.generateAccessToken(newUser.id);
    const refreshToken = this.generateRefreshToken(newUser.id);
    
    this.refreshTokens.set(refreshToken, newUser.id);

    return {
      data: {
        user: userWithoutPassword,
        accessToken,
      },
      success: true,
      message: 'User registered successfully',
    };
  }

  async login(loginDto: LoginDto): Promise<ApiResponse<{ user: User; accessToken: string }>> {
    const user = this.users.find(u => u.email === loginDto.email && u.password === loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password, ...userWithoutPassword } = user;
    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);
    
    this.refreshTokens.set(refreshToken, user.id);

    return {
      data: {
        user: userWithoutPassword,
        accessToken,
      },
      success: true,
      message: 'Login successful',
    };
  }

  async refresh(refreshToken: string): Promise<ApiResponse<{ accessToken: string }>> {
    const userId = this.refreshTokens.get(refreshToken);
    if (!userId) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = this.users.find(u => u.id === userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const newAccessToken = this.generateAccessToken(userId);

    return {
      data: { accessToken: newAccessToken },
      success: true,
      message: 'Token refreshed successfully',
    };
  }

  async logout(refreshToken: string): Promise<ApiResponse<null>> {
    this.refreshTokens.delete(refreshToken);

    return {
      data: null,
      success: true,
      message: 'Logout successful',
    };
  }

  async getProfile(userId: string): Promise<ApiResponse<User>> {
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password, ...userWithoutPassword } = user;

    return {
      data: userWithoutPassword,
      success: true,
      message: 'Profile retrieved successfully',
    };
  }

  async forgotPassword(email: string): Promise<ApiResponse<null>> {
    const user = this.users.find(u => u.email === email);
    if (!user) {
      // Don't reveal if email exists for security
      return {
        data: null,
        success: true,
        message: 'If the email exists, a password reset link has been sent',
      };
    }

    // In real app, send email with reset token
    console.log(`Password reset email would be sent to ${email}`);

    return {
      data: null,
      success: true,
      message: 'If the email exists, a password reset link has been sent',
    };
  }

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<null>> {
    // Mock token validation - in real app, validate JWT token or database token
    if (!token || token.length < 10) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // In real app, find user by token and update password
    return {
      data: null,
      success: true,
      message: 'Password reset successfully',
    };
  }

  private generateAccessToken(userId: string): string {
    // Mock JWT token - in real app, use proper JWT library
    return `access_token_${userId}_${Date.now()}`;
  }

  private generateRefreshToken(userId: string): string {
    // Mock refresh token - in real app, use proper JWT library
    return `refresh_token_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
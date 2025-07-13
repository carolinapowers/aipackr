import { Injectable, NotFoundException } from '@nestjs/common';
import {
  User,
  UserPreferences,
  ApiResponse,
  PaginatedResponse,
} from '@aipackr/types';
import { CreateUserDto, UpdateUserDto } from './users.controller';

@Injectable()
export class UsersService {
  private users: User[] = [];

  async findAll({ page, limit }: { page: number; limit: number }): Promise<PaginatedResponse<User>> {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = this.users.slice(startIndex, endIndex);

    return {
      data: paginatedUsers,
      pagination: {
        page,
        limit,
        total: this.users.length,
        totalPages: Math.ceil(this.users.length / limit),
      },
    };
  }

  async findOne(id: string): Promise<ApiResponse<User>> {
    const user = this.users.find(u => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return {
      data: user,
      success: true,
      message: 'User retrieved successfully',
    };
  }

  async create(createUserDto: CreateUserDto): Promise<ApiResponse<User>> {
    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: createUserDto.email,
      name: createUserDto.name,
      preferences: createUserDto.preferences,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(newUser);

    return {
      data: newUser,
      success: true,
      message: 'User created successfully',
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<ApiResponse<User>> {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateUserDto,
      updatedAt: new Date(),
    };

    return {
      data: this.users[userIndex],
      success: true,
      message: 'User updated successfully',
    };
  }

  async remove(id: string): Promise<void> {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    this.users.splice(userIndex, 1);
  }

  async getPreferences(id: string): Promise<ApiResponse<UserPreferences>> {
    const user = this.users.find(u => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return {
      data: user.preferences || {
        defaultBagSize: 'carry_on' as any,
        stylePreferences: [],
      },
      success: true,
      message: 'User preferences retrieved successfully',
    };
  }

  async updatePreferences(id: string, preferences: UserPreferences): Promise<ApiResponse<UserPreferences>> {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    this.users[userIndex].preferences = preferences;
    this.users[userIndex].updatedAt = new Date();

    return {
      data: preferences,
      success: true,
      message: 'User preferences updated successfully',
    };
  }
}
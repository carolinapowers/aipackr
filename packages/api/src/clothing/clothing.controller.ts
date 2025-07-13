import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { ClothingService } from './clothing.service';
import {
  ClothingItem,
  ClothingCategory,
  WeatherType,
  FormalityLevel,
  ApiResponse as ApiResponseType,
  PaginatedResponse,
  CreateClothingItemRequest,
  ClothingAnalysisResult,
} from '@aipackr/types';

@ApiTags('Clothing')
@ApiBearerAuth()
@Controller('clothing')
export class ClothingController {
  constructor(private readonly clothingService: ClothingService) {}

  @Get()
  @ApiOperation({ summary: 'Get all clothing items with pagination and filtering' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiQuery({ name: 'userId', required: false, type: String, description: 'Filter by user ID' })
  @ApiQuery({ name: 'category', required: false, enum: ClothingCategory, description: 'Filter by category' })
  @ApiQuery({ name: 'weatherType', required: false, enum: WeatherType, description: 'Filter by weather suitability' })
  @ApiResponse({
    status: 200,
    description: 'Clothing items retrieved successfully',
    type: Object,
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('userId') userId?: string,
    @Query('category') category?: ClothingCategory,
    @Query('weatherType') weatherType?: WeatherType,
  ): Promise<PaginatedResponse<ClothingItem>> {
    return this.clothingService.findAll({ page, limit, userId, category, weatherType });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get clothing item by ID' })
  @ApiParam({ name: 'id', description: 'Clothing item ID' })
  @ApiResponse({
    status: 200,
    description: 'Clothing item found',
    type: Object,
  })
  @ApiResponse({
    status: 404,
    description: 'Clothing item not found',
  })
  async findOne(@Param('id') id: string): Promise<ApiResponseType<ClothingItem>> {
    return this.clothingService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new clothing item' })
  @ApiResponse({
    status: 201,
    description: 'Clothing item created successfully',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async create(@Body() createClothingDto: CreateClothingItemRequest): Promise<ApiResponseType<ClothingItem>> {
    return this.clothingService.create(createClothingDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update clothing item by ID' })
  @ApiParam({ name: 'id', description: 'Clothing item ID' })
  @ApiResponse({
    status: 200,
    description: 'Clothing item updated successfully',
    type: Object,
  })
  @ApiResponse({
    status: 404,
    description: 'Clothing item not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateClothingDto: Partial<CreateClothingItemRequest>,
  ): Promise<ApiResponseType<ClothingItem>> {
    return this.clothingService.update(id, updateClothingDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete clothing item by ID' })
  @ApiParam({ name: 'id', description: 'Clothing item ID' })
  @ApiResponse({
    status: 204,
    description: 'Clothing item deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Clothing item not found',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.clothingService.remove(id);
  }

  @Post(':id/upload-image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload image for clothing item' })
  @ApiParam({ name: 'id', description: 'Clothing item ID' })
  @ApiResponse({
    status: 200,
    description: 'Image uploaded successfully',
    type: Object,
  })
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: any,
  ): Promise<ApiResponseType<ClothingItem>> {
    return this.clothingService.uploadImage(id, file);
  }

  @Post('analyze-image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Analyze clothing item from image using AI' })
  @ApiResponse({
    status: 200,
    description: 'Image analyzed successfully',
    type: Object,
  })
  async analyzeImage(
    @UploadedFile() file: any,
  ): Promise<ApiResponseType<ClothingAnalysisResult>> {
    return this.clothingService.analyzeImage(file);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all clothing items for a specific user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiResponse({
    status: 200,
    description: 'User clothing items retrieved successfully',
    type: Object,
  })
  async findByUser(
    @Param('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<PaginatedResponse<ClothingItem>> {
    return this.clothingService.findByUser(userId, { page, limit });
  }

  @Get('suggestions/:tripId')
  @ApiOperation({ summary: 'Get clothing suggestions for a specific trip' })
  @ApiParam({ name: 'tripId', description: 'Trip ID' })
  @ApiResponse({
    status: 200,
    description: 'Clothing suggestions retrieved successfully',
    type: Object,
  })
  async getSuggestionsForTrip(@Param('tripId') tripId: string): Promise<ApiResponseType<ClothingItem[]>> {
    return this.clothingService.getSuggestionsForTrip(tripId);
  }
}
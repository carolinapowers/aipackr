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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TripsService } from './trips.service';
import {
  Trip,
  PackingRecommendation,
  ApiResponse as ApiResponseType,
  PaginatedResponse,
  CreateTripRequest,
  UpdateTripRequest,
  TripStatus,
} from '@aipackr/types';

@ApiTags('Trips')
@ApiBearerAuth()
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all trips with pagination and filtering' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiQuery({ name: 'userId', required: false, type: String, description: 'Filter by user ID' })
  @ApiQuery({ name: 'status', required: false, enum: TripStatus, description: 'Filter by trip status' })
  @ApiResponse({
    status: 200,
    description: 'Trips retrieved successfully',
    type: Object,
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('userId') userId?: string,
    @Query('status') status?: TripStatus,
  ): Promise<PaginatedResponse<Trip>> {
    return this.tripsService.findAll({ page, limit, userId, status });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get trip by ID' })
  @ApiParam({ name: 'id', description: 'Trip ID' })
  @ApiResponse({
    status: 200,
    description: 'Trip found',
    type: Object,
  })
  @ApiResponse({
    status: 404,
    description: 'Trip not found',
  })
  async findOne(@Param('id') id: string): Promise<ApiResponseType<Trip>> {
    return this.tripsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new trip' })
  @ApiResponse({
    status: 201,
    description: 'Trip created successfully',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async create(@Body() createTripDto: CreateTripRequest): Promise<ApiResponseType<Trip>> {
    return this.tripsService.create(createTripDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update trip by ID' })
  @ApiParam({ name: 'id', description: 'Trip ID' })
  @ApiResponse({
    status: 200,
    description: 'Trip updated successfully',
    type: Object,
  })
  @ApiResponse({
    status: 404,
    description: 'Trip not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateTripDto: UpdateTripRequest,
  ): Promise<ApiResponseType<Trip>> {
    return this.tripsService.update(id, updateTripDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete trip by ID' })
  @ApiParam({ name: 'id', description: 'Trip ID' })
  @ApiResponse({
    status: 204,
    description: 'Trip deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Trip not found',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.tripsService.remove(id);
  }

  @Get(':id/recommendations')
  @ApiOperation({ summary: 'Get packing recommendations for a trip' })
  @ApiParam({ name: 'id', description: 'Trip ID' })
  @ApiResponse({
    status: 200,
    description: 'Packing recommendations generated',
    type: Object,
  })
  @ApiResponse({
    status: 404,
    description: 'Trip not found',
  })
  async getRecommendations(@Param('id') id: string): Promise<ApiResponseType<PackingRecommendation>> {
    return this.tripsService.getRecommendations(id);
  }

  @Post(':id/recommendations/generate')
  @ApiOperation({ summary: 'Generate new packing recommendations for a trip' })
  @ApiParam({ name: 'id', description: 'Trip ID' })
  @ApiResponse({
    status: 201,
    description: 'Packing recommendations generated successfully',
    type: Object,
  })
  async generateRecommendations(@Param('id') id: string): Promise<ApiResponseType<PackingRecommendation>> {
    return this.tripsService.generateRecommendations(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all trips for a specific user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiResponse({
    status: 200,
    description: 'User trips retrieved successfully',
    type: Object,
  })
  async findByUser(
    @Param('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<PaginatedResponse<Trip>> {
    return this.tripsService.findByUser(userId, { page, limit });
  }
}
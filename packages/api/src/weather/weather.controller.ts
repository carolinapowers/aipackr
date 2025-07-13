import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { WeatherService } from './weather.service';
import {
  WeatherData,
  ApiResponse as ApiResponseType,
} from '@aipackr/types';

@ApiTags('Weather')
@ApiBearerAuth()
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('forecast/:destination')
  @ApiOperation({ summary: 'Get weather forecast for destination' })
  @ApiParam({ name: 'destination', description: 'Destination name or coordinates' })
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Number of days to forecast (default: 7)' })
  @ApiResponse({
    status: 200,
    description: 'Weather forecast retrieved successfully',
    type: Object,
  })
  async getForecast(
    @Param('destination') destination: string,
    @Query('days') days: number = 7,
  ): Promise<ApiResponseType<WeatherData[]>> {
    return this.weatherService.getForecast(destination, days);
  }

  @Get('current/:destination')
  @ApiOperation({ summary: 'Get current weather for destination' })
  @ApiParam({ name: 'destination', description: 'Destination name or coordinates' })
  @ApiResponse({
    status: 200,
    description: 'Current weather retrieved successfully',
    type: Object,
  })
  async getCurrentWeather(
    @Param('destination') destination: string,
  ): Promise<ApiResponseType<WeatherData>> {
    return this.weatherService.getCurrentWeather(destination);
  }

  @Get('historical/:destination')
  @ApiOperation({ summary: 'Get historical weather data for destination' })
  @ApiParam({ name: 'destination', description: 'Destination name or coordinates' })
  @ApiQuery({ name: 'startDate', required: true, type: String, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: true, type: String, description: 'End date (YYYY-MM-DD)' })
  @ApiResponse({
    status: 200,
    description: 'Historical weather data retrieved successfully',
    type: Object,
  })
  async getHistoricalWeather(
    @Param('destination') destination: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<ApiResponseType<WeatherData[]>> {
    return this.weatherService.getHistoricalWeather(destination, startDate, endDate);
  }
}
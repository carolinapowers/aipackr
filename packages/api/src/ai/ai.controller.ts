import {
  Controller,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { AiService } from './ai.service';
import {
  ClothingAnalysisResult,
  PackingRecommendation,
  FashionTrendData,
  ApiResponse as ApiResponseType,
} from '@aipackr/types';

@ApiTags('AI')
@ApiBearerAuth()
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('analyze-clothing')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Analyze clothing item from image using AI' })
  @ApiResponse({
    status: 200,
    description: 'Clothing item analyzed successfully',
    type: Object,
  })
  async analyzeClothing(
    @UploadedFile() image: any,
  ): Promise<ApiResponseType<ClothingAnalysisResult>> {
    return this.aiService.analyzeClothing(image);
  }

  @Post('generate-recommendations/:tripId')
  @ApiOperation({ summary: 'Generate AI-powered packing recommendations for a trip' })
  @ApiParam({ name: 'tripId', description: 'Trip ID' })
  @ApiResponse({
    status: 200,
    description: 'Packing recommendations generated successfully',
    type: Object,
  })
  async generatePackingRecommendations(
    @Param('tripId') tripId: string,
  ): Promise<ApiResponseType<PackingRecommendation>> {
    return this.aiService.generatePackingRecommendations(tripId);
  }

  @Post('fashion-trends')
  @ApiOperation({ summary: 'Get AI-powered fashion trends for destinations' })
  @ApiResponse({
    status: 200,
    description: 'Fashion trends retrieved successfully',
    type: Object,
  })
  async getFashionTrends(
    @Body() request: { destinations: string[]; season?: string },
  ): Promise<ApiResponseType<FashionTrendData[]>> {
    return this.aiService.getFashionTrends(request.destinations, request.season);
  }

  @Post('optimize-packing')
  @ApiOperation({ summary: 'Optimize packing list using AI algorithms' })
  @ApiResponse({
    status: 200,
    description: 'Packing list optimized successfully',
    type: Object,
  })
  async optimizePackingList(
    @Body() request: { tripId: string; constraints?: any },
  ): Promise<ApiResponseType<{ optimizedItems: any[]; efficiency: number }>> {
    return this.aiService.optimizePackingList(request.tripId, request.constraints);
  }

  @Post('style-recommendations')
  @ApiOperation({ summary: 'Get personalized style recommendations' })
  @ApiResponse({
    status: 200,
    description: 'Style recommendations generated successfully',
    type: Object,
  })
  async getStyleRecommendations(
    @Body() request: { userId: string; preferences?: any; occasion?: string },
  ): Promise<ApiResponseType<{ recommendations: any[]; confidence: number }>> {
    return this.aiService.getStyleRecommendations(request.userId, request.preferences, request.occasion);
  }
}
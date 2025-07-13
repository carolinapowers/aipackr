import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ClothingItem,
  ClothingCategory,
  WeatherType,
  FormalityLevel,
  ApiResponse,
  PaginatedResponse,
  CreateClothingItemRequest,
  ClothingAnalysisResult,
} from '@aipackr/types';

@Injectable()
export class ClothingService {
  private clothingItems: ClothingItem[] = [];

  async findAll({
    page,
    limit,
    userId,
    category,
    weatherType,
  }: {
    page: number;
    limit: number;
    userId?: string;
    category?: ClothingCategory;
    weatherType?: WeatherType;
  }): Promise<PaginatedResponse<ClothingItem>> {
    let filteredItems = this.clothingItems;

    if (userId) {
      filteredItems = filteredItems.filter(item => item.userId === userId);
    }

    if (category) {
      filteredItems = filteredItems.filter(item => item.category === category);
    }

    if (weatherType) {
      filteredItems = filteredItems.filter(item => 
        item.weatherSuitability.includes(weatherType)
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    return {
      data: paginatedItems,
      pagination: {
        page,
        limit,
        total: filteredItems.length,
        totalPages: Math.ceil(filteredItems.length / limit),
      },
    };
  }

  async findOne(id: string): Promise<ApiResponse<ClothingItem>> {
    const item = this.clothingItems.find(item => item.id === id);
    if (!item) {
      throw new NotFoundException(`Clothing item with ID ${id} not found`);
    }

    return {
      data: item,
      success: true,
      message: 'Clothing item retrieved successfully',
    };
  }

  async create(createClothingDto: CreateClothingItemRequest): Promise<ApiResponse<ClothingItem>> {
    const newItem: ClothingItem = {
      id: `clothing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: 'current_user_id', // In real app, get from auth context
      name: createClothingDto.name,
      category: createClothingDto.category,
      subcategory: createClothingDto.subcategory,
      color: createClothingDto.color,
      brand: createClothingDto.brand,
      imageUrl: '', // Will be set when image is uploaded
      tags: createClothingDto.tags,
      weatherSuitability: this.inferWeatherSuitability(createClothingDto.category),
      formalityLevel: createClothingDto.formalityLevel,
      createdAt: new Date(),
    };

    this.clothingItems.push(newItem);

    return {
      data: newItem,
      success: true,
      message: 'Clothing item created successfully',
    };
  }

  async update(id: string, updateClothingDto: Partial<CreateClothingItemRequest>): Promise<ApiResponse<ClothingItem>> {
    const itemIndex = this.clothingItems.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      throw new NotFoundException(`Clothing item with ID ${id} not found`);
    }

    const updatedItem = {
      ...this.clothingItems[itemIndex],
      ...updateClothingDto,
    };

    if (updateClothingDto.category) {
      updatedItem.weatherSuitability = this.inferWeatherSuitability(updateClothingDto.category);
    }

    this.clothingItems[itemIndex] = updatedItem;

    return {
      data: updatedItem,
      success: true,
      message: 'Clothing item updated successfully',
    };
  }

  async remove(id: string): Promise<void> {
    const itemIndex = this.clothingItems.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      throw new NotFoundException(`Clothing item with ID ${id} not found`);
    }

    this.clothingItems.splice(itemIndex, 1);
  }

  async uploadImage(id: string, file: any): Promise<ApiResponse<ClothingItem>> {
    const itemIndex = this.clothingItems.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      throw new NotFoundException(`Clothing item with ID ${id} not found`);
    }

    // Mock image upload - in real app, upload to cloud storage
    const imageUrl = `https://storage.aipackr.com/clothing/${id}/${file.originalname}`;
    this.clothingItems[itemIndex].imageUrl = imageUrl;

    return {
      data: this.clothingItems[itemIndex],
      success: true,
      message: 'Image uploaded successfully',
    };
  }

  async analyzeImage(file: any): Promise<ApiResponse<ClothingAnalysisResult>> {
    // Mock AI analysis - in real app, use AI service
    const analysisResult: ClothingAnalysisResult = {
      category: ClothingCategory.TOPS,
      subcategory: 'T-shirt',
      color: 'Blue',
      brand: 'Unknown',
      tags: ['casual', 'cotton', 'short-sleeve'],
      formalityLevel: FormalityLevel.CASUAL,
      weatherSuitability: [WeatherType.WARM, WeatherType.MILD],
      confidence: 0.89,
    };

    return {
      data: analysisResult,
      success: true,
      message: 'Image analyzed successfully',
    };
  }

  async findByUser(userId: string, { page, limit }: { page: number; limit: number }): Promise<PaginatedResponse<ClothingItem>> {
    return this.findAll({ page, limit, userId });
  }

  async getSuggestionsForTrip(tripId: string): Promise<ApiResponse<ClothingItem[]>> {
    // Mock trip-based suggestions - in real app, analyze trip details
    const suggestions = this.clothingItems.slice(0, 10);

    return {
      data: suggestions,
      success: true,
      message: 'Clothing suggestions retrieved successfully',
    };
  }

  private inferWeatherSuitability(category: ClothingCategory): WeatherType[] {
    const suitabilityMap: Record<ClothingCategory, WeatherType[]> = {
      [ClothingCategory.TOPS]: [WeatherType.MILD, WeatherType.WARM],
      [ClothingCategory.BOTTOMS]: [WeatherType.MILD, WeatherType.WARM, WeatherType.COOL],
      [ClothingCategory.OUTERWEAR]: [WeatherType.COOL, WeatherType.COLD, WeatherType.WINDY],
      [ClothingCategory.DRESSES]: [WeatherType.WARM, WeatherType.MILD],
      [ClothingCategory.SHOES]: [WeatherType.MILD, WeatherType.WARM, WeatherType.COOL],
      [ClothingCategory.UNDERGARMENTS]: [WeatherType.MILD, WeatherType.WARM, WeatherType.COOL, WeatherType.COLD],
      [ClothingCategory.ACCESSORIES]: [WeatherType.MILD, WeatherType.WARM, WeatherType.COOL],
      [ClothingCategory.SWIMWEAR]: [WeatherType.HOT, WeatherType.WARM],
      [ClothingCategory.SLEEPWEAR]: [WeatherType.MILD, WeatherType.WARM, WeatherType.COOL],
      [ClothingCategory.ATHLETIC]: [WeatherType.MILD, WeatherType.WARM, WeatherType.COOL],
    };

    return suitabilityMap[category] || [WeatherType.MILD];
  }
}
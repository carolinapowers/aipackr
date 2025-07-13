import { Injectable } from '@nestjs/common';
import {
  WeatherData,
  WeatherCondition,
  ApiResponse,
} from '@aipackr/types';

@Injectable()
export class WeatherService {
  async getForecast(destination: string, days: number): Promise<ApiResponse<WeatherData[]>> {
    // Mock weather data - in real app, integrate with weather API
    const forecast: WeatherData[] = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      forecast.push({
        date,
        temperature: {
          min: Math.floor(Math.random() * 10) + 15,
          max: Math.floor(Math.random() * 15) + 20,
        },
        humidity: Math.floor(Math.random() * 40) + 40,
        precipitation: {
          probability: Math.floor(Math.random() * 100),
          amount: Math.random() * 10,
        },
        windSpeed: Math.floor(Math.random() * 20) + 5,
        condition: this.getRandomCondition(),
        uvIndex: Math.floor(Math.random() * 11),
      });
    }

    return {
      data: forecast,
      success: true,
      message: `Weather forecast for ${destination} retrieved successfully`,
    };
  }

  async getCurrentWeather(destination: string): Promise<ApiResponse<WeatherData>> {
    const currentWeather: WeatherData = {
      date: new Date(),
      temperature: {
        min: 18,
        max: 25,
      },
      humidity: 65,
      precipitation: {
        probability: 20,
        amount: 0,
      },
      windSpeed: 8,
      condition: WeatherCondition.PARTLY_CLOUDY,
      uvIndex: 6,
    };

    return {
      data: currentWeather,
      success: true,
      message: `Current weather for ${destination} retrieved successfully`,
    };
  }

  async getHistoricalWeather(
    destination: string,
    startDate: string,
    endDate: string,
  ): Promise<ApiResponse<WeatherData[]>> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const historicalData: WeatherData[] = [];

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      historicalData.push({
        date: new Date(date),
        temperature: {
          min: Math.floor(Math.random() * 10) + 15,
          max: Math.floor(Math.random() * 15) + 20,
        },
        humidity: Math.floor(Math.random() * 40) + 40,
        precipitation: {
          probability: Math.floor(Math.random() * 100),
          amount: Math.random() * 10,
        },
        windSpeed: Math.floor(Math.random() * 20) + 5,
        condition: this.getRandomCondition(),
        uvIndex: Math.floor(Math.random() * 11),
      });
    }

    return {
      data: historicalData,
      success: true,
      message: `Historical weather data for ${destination} retrieved successfully`,
    };
  }

  private getRandomCondition(): WeatherCondition {
    const conditions = Object.values(WeatherCondition);
    return conditions[Math.floor(Math.random() * conditions.length)];
  }
}
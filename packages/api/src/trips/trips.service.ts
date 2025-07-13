import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Trip,
  PackingRecommendation,
  ApiResponse,
  PaginatedResponse,
  CreateTripRequest,
  UpdateTripRequest,
  TripStatus,
  DailyOutfit,
} from '@aipackr/types';

@Injectable()
export class TripsService {
  private trips: Trip[] = [];
  private recommendations: Map<string, PackingRecommendation> = new Map();

  async findAll({
    page,
    limit,
    userId,
    status,
  }: {
    page: number;
    limit: number;
    userId?: string;
    status?: TripStatus;
  }): Promise<PaginatedResponse<Trip>> {
    let filteredTrips = this.trips;

    if (userId) {
      filteredTrips = filteredTrips.filter(trip => trip.userId === userId);
    }

    if (status) {
      filteredTrips = filteredTrips.filter(trip => trip.status === status);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTrips = filteredTrips.slice(startIndex, endIndex);

    return {
      data: paginatedTrips,
      pagination: {
        page,
        limit,
        total: filteredTrips.length,
        totalPages: Math.ceil(filteredTrips.length / limit),
      },
    };
  }

  async findOne(id: string): Promise<ApiResponse<Trip>> {
    const trip = this.trips.find(t => t.id === id);
    if (!trip) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }

    return {
      data: trip,
      success: true,
      message: 'Trip retrieved successfully',
    };
  }

  async create(createTripDto: CreateTripRequest): Promise<ApiResponse<Trip>> {
    const newTrip: Trip = {
      id: `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: 'current_user_id', // In real app, get from auth context
      name: createTripDto.name,
      destinations: createTripDto.destinations.map((dest, index) => ({
        id: `dest_${Date.now()}_${index}`,
        ...dest,
      })),
      startDate: new Date(createTripDto.startDate),
      endDate: new Date(createTripDto.endDate),
      bagSize: createTripDto.bagSize,
      activities: createTripDto.activities.map((activity, index) => ({
        id: `activity_${Date.now()}_${index}`,
        ...activity,
      })),
      status: TripStatus.PLANNING,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.trips.push(newTrip);

    return {
      data: newTrip,
      success: true,
      message: 'Trip created successfully',
    };
  }

  async update(id: string, updateTripDto: UpdateTripRequest): Promise<ApiResponse<Trip>> {
    const tripIndex = this.trips.findIndex(t => t.id === id);
    if (tripIndex === -1) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }

    const updatedTrip = { ...this.trips[tripIndex] };

    if (updateTripDto.name) updatedTrip.name = updateTripDto.name;
    if (updateTripDto.startDate) updatedTrip.startDate = new Date(updateTripDto.startDate);
    if (updateTripDto.endDate) updatedTrip.endDate = new Date(updateTripDto.endDate);
    if (updateTripDto.bagSize) updatedTrip.bagSize = updateTripDto.bagSize;
    if (updateTripDto.status) updatedTrip.status = updateTripDto.status;
    if (updateTripDto.destinations) {
      updatedTrip.destinations = updateTripDto.destinations.map((dest, index) => ({
        id: `dest_${Date.now()}_${index}`,
        ...dest,
      }));
    }
    if (updateTripDto.activities) {
      updatedTrip.activities = updateTripDto.activities.map((activity, index) => ({
        id: `activity_${Date.now()}_${index}`,
        ...activity,
      }));
    }

    updatedTrip.updatedAt = new Date();
    this.trips[tripIndex] = updatedTrip;

    return {
      data: updatedTrip,
      success: true,
      message: 'Trip updated successfully',
    };
  }

  async remove(id: string): Promise<void> {
    const tripIndex = this.trips.findIndex(t => t.id === id);
    if (tripIndex === -1) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }

    this.trips.splice(tripIndex, 1);
    this.recommendations.delete(id);
  }

  async getRecommendations(id: string): Promise<ApiResponse<PackingRecommendation>> {
    const trip = this.trips.find(t => t.id === id);
    if (!trip) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }

    const recommendation = this.recommendations.get(id);
    if (!recommendation) {
      throw new NotFoundException(`No packing recommendations found for trip ${id}`);
    }

    return {
      data: recommendation,
      success: true,
      message: 'Packing recommendations retrieved successfully',
    };
  }

  async generateRecommendations(id: string): Promise<ApiResponse<PackingRecommendation>> {
    const trip = this.trips.find(t => t.id === id);
    if (!trip) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }

    // Mock recommendation generation
    const dailyOutfits: DailyOutfit[] = [];
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dailyOutfits.push({
        date: new Date(d),
        weather: {
          date: new Date(d),
          temperature: { min: 20, max: 25 },
          humidity: 60,
          precipitation: { probability: 10 },
          windSpeed: 5,
          condition: 'sunny' as any,
          uvIndex: 7,
        },
        activities: trip.activities.slice(0, 2),
        outfit: {},
        accessories: [],
        notes: ['Perfect weather for sightseeing'],
      });
    }

    const recommendation: PackingRecommendation = {
      tripId: id,
      dailyOutfits,
      totalItems: [],
      bagUtilization: 75,
      culturalNotes: ['Dress modestly when visiting religious sites'],
      weatherWarnings: [],
      generatedAt: new Date(),
    };

    this.recommendations.set(id, recommendation);

    return {
      data: recommendation,
      success: true,
      message: 'Packing recommendations generated successfully',
    };
  }

  async findByUser(userId: string, { page, limit }: { page: number; limit: number }): Promise<PaginatedResponse<Trip>> {
    return this.findAll({ page, limit, userId });
  }
}
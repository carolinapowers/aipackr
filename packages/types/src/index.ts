// Core domain types
export interface User {
  id: string;
  email: string;
  name: string;
  preferences?: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  defaultBagSize: BagSize;
  stylePreferences: string[];
  allergies?: string[];
  dietaryRestrictions?: string[];
}

export interface Trip {
  id: string;
  userId: string;
  name: string;
  destinations: Destination[];
  startDate: Date;
  endDate: Date;
  bagSize: BagSize;
  activities: Activity[];
  status: TripStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  timezone: string;
}

export interface Activity {
  id: string;
  name: string;
  type: ActivityType;
  description?: string;
  dressCode?: DressCode;
  formalityLevel: FormalityLevel;
}

export interface ClothingItem {
  id: string;
  userId: string;
  name: string;
  category: ClothingCategory;
  subcategory: string;
  color: string;
  brand?: string;
  imageUrl: string;
  tags: string[];
  weatherSuitability: WeatherType[];
  formalityLevel: FormalityLevel;
  createdAt: Date;
}

export interface WeatherData {
  date: Date;
  temperature: {
    min: number;
    max: number;
  };
  humidity: number;
  precipitation: {
    probability: number;
    amount?: number;
  };
  windSpeed: number;
  condition: WeatherCondition;
  uvIndex: number;
}

export interface PackingRecommendation {
  tripId: string;
  dailyOutfits: DailyOutfit[];
  totalItems: ClothingItem[];
  bagUtilization: number;
  culturalNotes: string[];
  weatherWarnings: string[];
  generatedAt: Date;
}

export interface DailyOutfit {
  date: Date;
  weather: WeatherData;
  activities: Activity[];
  outfit: {
    [key in ClothingCategory]?: ClothingItem;
  };
  accessories: ClothingItem[];
  notes?: string[];
}

// Enums
export enum BagSize {
  CARRY_ON = 'carry_on',
  CHECKED_SMALL = 'checked_small',
  CHECKED_MEDIUM = 'checked_medium',
  CHECKED_LARGE = 'checked_large',
  BACKPACK = 'backpack',
  DUFFEL = 'duffel',
}

export enum TripStatus {
  PLANNING = 'planning',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ActivityType {
  SIGHTSEEING = 'sightseeing',
  DINING = 'dining',
  BUSINESS = 'business',
  OUTDOOR = 'outdoor',
  CULTURAL = 'cultural',
  NIGHTLIFE = 'nightlife',
  SPORTS = 'sports',
  RELAXATION = 'relaxation',
  SHOPPING = 'shopping',
  ADVENTURE = 'adventure',
}

export enum DressCode {
  CASUAL = 'casual',
  SMART_CASUAL = 'smart_casual',
  BUSINESS = 'business',
  BUSINESS_FORMAL = 'business_formal',
  COCKTAIL = 'cocktail',
  FORMAL = 'formal',
  BLACK_TIE = 'black_tie',
  ATHLETIC = 'athletic',
  BEACHWEAR = 'beachwear',
}

export enum FormalityLevel {
  VERY_CASUAL = 1,
  CASUAL = 2,
  SMART_CASUAL = 3,
  SEMI_FORMAL = 4,
  FORMAL = 5,
}

export enum ClothingCategory {
  TOPS = 'tops',
  BOTTOMS = 'bottoms',
  OUTERWEAR = 'outerwear',
  DRESSES = 'dresses',
  SHOES = 'shoes',
  UNDERGARMENTS = 'undergarments',
  ACCESSORIES = 'accessories',
  SWIMWEAR = 'swimwear',
  SLEEPWEAR = 'sleepwear',
  ATHLETIC = 'athletic',
}

export enum WeatherType {
  HOT = 'hot',
  WARM = 'warm',
  MILD = 'mild',
  COOL = 'cool',
  COLD = 'cold',
  RAINY = 'rainy',
  SNOWY = 'snowy',
  WINDY = 'windy',
  HUMID = 'humid',
  DRY = 'dry',
}

export enum WeatherCondition {
  SUNNY = 'sunny',
  PARTLY_CLOUDY = 'partly_cloudy',
  CLOUDY = 'cloudy',
  RAINY = 'rainy',
  STORMY = 'stormy',
  SNOWY = 'snowy',
  FOGGY = 'foggy',
  WINDY = 'windy',
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Request types
export interface CreateTripRequest {
  name: string;
  destinations: Omit<Destination, 'id'>[];
  startDate: string;
  endDate: string;
  bagSize: BagSize;
  activities: Omit<Activity, 'id'>[];
}

export interface UpdateTripRequest extends Partial<CreateTripRequest> {
  status?: TripStatus;
}

export interface CreateClothingItemRequest {
  name: string;
  category: ClothingCategory;
  subcategory: string;
  color: string;
  brand?: string;
  tags: string[];
  formalityLevel: FormalityLevel;
}

export interface UploadImageRequest {
  file: File;
  itemId?: string;
}

// AI Analysis types
export interface ClothingAnalysisResult {
  category: ClothingCategory;
  subcategory: string;
  color: string;
  brand?: string;
  tags: string[];
  formalityLevel: FormalityLevel;
  weatherSuitability: WeatherType[];
  confidence: number;
}

export interface FashionTrendData {
  destination: string;
  trends: string[];
  culturalConsiderations: string[];
  seasonalColors: string[];
  source: string;
  scrapedAt: Date;
}
import { ClothingItem, DailyOutfit, WeatherData, Activity, ClothingCategory } from '@aipackr/types';

export interface OutfitConstraints {
  weatherData: WeatherData;
  activities: Activity[];
  availableItems: ClothingItem[];
  culturalConsiderations?: string[];
}

export class OutfitGenerator {
  generateDailyOutfit(date: Date, constraints: OutfitConstraints): DailyOutfit {
    const { weatherData, activities, availableItems } = constraints;
    
    const suitableItems = this.filterItemsByWeatherAndActivities(
      availableItems,
      weatherData,
      activities
    );

    const outfit = this.buildOutfit(suitableItems, activities);
    const accessories = this.selectAccessories(suitableItems, weatherData, activities);

    return {
      date,
      weather: weatherData,
      activities,
      outfit,
      accessories,
      notes: this.generateOutfitNotes(outfit, weatherData, activities, constraints.culturalConsiderations)
    };
  }

  private filterItemsByWeatherAndActivities(
    items: ClothingItem[],
    weather: WeatherData,
    activities: Activity[]
  ): ClothingItem[] {
    return items.filter(item => {
      const weatherMatch = this.isWeatherSuitable(item, weather);
      const activityMatch = this.isActivitySuitable(item, activities);
      return weatherMatch && activityMatch;
    });
  }

  private isWeatherSuitable(item: ClothingItem, weather: WeatherData): boolean {
    const temp = (weather.temperature.min + weather.temperature.max) / 2;
    
    if (temp > 25) {
      return item.weatherSuitability.some(w => ['hot', 'warm', 'dry'].includes(w));
    } else if (temp > 15) {
      return item.weatherSuitability.some(w => ['warm', 'mild'].includes(w));
    } else if (temp > 5) {
      return item.weatherSuitability.some(w => ['mild', 'cool'].includes(w));
    } else {
      return item.weatherSuitability.some(w => ['cool', 'cold'].includes(w));
    }
  }

  private isActivitySuitable(item: ClothingItem, activities: Activity[]): boolean {
    const maxFormalityRequired = Math.max(...activities.map(a => a.formalityLevel));
    const minFormalityRequired = Math.min(...activities.map(a => a.formalityLevel));
    
    return item.formalityLevel >= minFormalityRequired && item.formalityLevel <= maxFormalityRequired + 1;
  }

  private buildOutfit(
    items: ClothingItem[],
    activities: Activity[]
  ): { [key in ClothingCategory]?: ClothingItem } {
    const outfit: { [key in ClothingCategory]?: ClothingItem } = {};
    
    const itemsByCategory = this.groupItemsByCategory(items);
    const requiredCategories = this.getRequiredCategories(activities);

    for (const category of requiredCategories) {
      const categoryItems = itemsByCategory[category] || [];
      if (categoryItems.length > 0) {
        outfit[category] = this.selectBestItem(categoryItems, activities);
      }
    }

    return outfit;
  }

  private groupItemsByCategory(items: ClothingItem[]): Record<ClothingCategory, ClothingItem[]> {
    const grouped = {} as Record<ClothingCategory, ClothingItem[]>;
    
    for (const item of items) {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    }

    return grouped;
  }

  private getRequiredCategories(activities: Activity[]): ClothingCategory[] {
    const hasAthletic = activities.some(a => a.type === 'sports' || a.type === 'outdoor');
    const hasFormal = activities.some(a => a.formalityLevel >= 4);
    const hasSwimming = activities.some(a => a.type === 'relaxation' && a.name.toLowerCase().includes('beach'));

    const categories: ClothingCategory[] = [
      ClothingCategory.TOPS,
      ClothingCategory.BOTTOMS,
      ClothingCategory.SHOES,
      ClothingCategory.UNDERGARMENTS
    ];

    if (hasAthletic) {
      categories.push(ClothingCategory.ATHLETIC);
    }

    if (hasFormal) {
      categories.push(ClothingCategory.DRESSES);
    }

    if (hasSwimming) {
      categories.push(ClothingCategory.SWIMWEAR);
    }

    return categories;
  }

  private selectBestItem(items: ClothingItem[], activities: Activity[]): ClothingItem {
    const targetFormality = Math.round(
      activities.reduce((sum, a) => sum + a.formalityLevel, 0) / activities.length
    );

    return items.reduce((best, current) => {
      const bestScore = this.calculateItemScore(best, targetFormality);
      const currentScore = this.calculateItemScore(current, targetFormality);
      return currentScore > bestScore ? current : best;
    });
  }

  private calculateItemScore(item: ClothingItem, targetFormality: number): number {
    let score = 0;
    
    const formalityDiff = Math.abs(item.formalityLevel - targetFormality);
    score += Math.max(0, 10 - formalityDiff);
    
    score += item.tags.length * 0.5;
    
    score += item.weatherSuitability.length * 0.3;

    return score;
  }

  private selectAccessories(
    items: ClothingItem[],
    weather: WeatherData,
    activities: Activity[]
  ): ClothingItem[] {
    const accessories = items.filter(item => item.category === ClothingCategory.ACCESSORIES);
    const selected: ClothingItem[] = [];

    if (weather.condition === 'rainy' && weather.precipitation.probability > 0.5) {
      const umbrella = accessories.find(item => 
        item.name.toLowerCase().includes('umbrella') || 
        item.tags.some(tag => tag.toLowerCase().includes('rain'))
      );
      if (umbrella) selected.push(umbrella);
    }

    if (weather.uvIndex > 6) {
      const sunglasses = accessories.find(item => 
        item.name.toLowerCase().includes('sunglasses') ||
        item.tags.some(tag => tag.toLowerCase().includes('sun'))
      );
      if (sunglasses) selected.push(sunglasses);
    }

    const hasFormalActivity = activities.some(a => a.formalityLevel >= 4);
    if (hasFormalActivity) {
      const formalAccessories = accessories.filter(item => item.formalityLevel >= 3);
      selected.push(...formalAccessories.slice(0, 2));
    }

    return selected;
  }

  private generateOutfitNotes(
    outfit: { [key in ClothingCategory]?: ClothingItem },
    weather: WeatherData,
    activities: Activity[],
    culturalConsiderations?: string[]
  ): string[] {
    const notes: string[] = [];

    if (weather.temperature.max > 30) {
      notes.push('Stay hydrated and seek shade during peak sun hours');
    }

    if (weather.precipitation.probability > 0.7) {
      notes.push('High chance of rain - consider waterproof options');
    }

    if (activities.some(a => a.formalityLevel >= 4)) {
      notes.push('Formal attire required for some activities');
    }

    if (culturalConsiderations) {
      notes.push(...culturalConsiderations);
    }

    return notes;
  }
}
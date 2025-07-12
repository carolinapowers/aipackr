import { ClothingItem, BagSize, Trip, PackingRecommendation } from '@aipackr/types';

export interface PackingConstraints {
  bagSize: BagSize;
  maxWeight?: number;
  maxItems?: number;
  essentialItems: string[];
}

export interface PackingScore {
  utilization: number;
  versatility: number;
  weatherMatch: number;
  activityMatch: number;
  overall: number;
}

export class PackingOptimizer {
  private readonly bagCapacities: Record<BagSize, { volume: number; weight: number }> = {
    [BagSize.CARRY_ON]: { volume: 56, weight: 7 },
    [BagSize.CHECKED_SMALL]: { volume: 68, weight: 23 },
    [BagSize.CHECKED_MEDIUM]: { volume: 85, weight: 23 },
    [BagSize.CHECKED_LARGE]: { volume: 119, weight: 32 },
    [BagSize.BACKPACK]: { volume: 45, weight: 15 },
    [BagSize.DUFFEL]: { volume: 60, weight: 20 },
  };

  optimize(
    trip: Trip,
    availableItems: ClothingItem[],
    constraints: PackingConstraints
  ): ClothingItem[] {
    const capacity = this.bagCapacities[constraints.bagSize];
    const essentialItems = this.getEssentialItems(availableItems, constraints.essentialItems);
    const optionalItems = availableItems.filter(item => !essentialItems.includes(item));
    
    const optimizedItems = [
      ...essentialItems,
      ...this.selectOptionalItems(trip, optionalItems, capacity, essentialItems)
    ];

    return this.removeDuplicates(optimizedItems);
  }

  calculatePackingScore(
    selectedItems: ClothingItem[],
    trip: Trip,
    constraints: PackingConstraints
  ): PackingScore {
    const capacity = this.bagCapacities[constraints.bagSize];
    const utilization = this.calculateUtilization(selectedItems, capacity);
    const versatility = this.calculateVersatility(selectedItems);
    const weatherMatch = this.calculateWeatherMatch(selectedItems, trip);
    const activityMatch = this.calculateActivityMatch(selectedItems, trip);
    
    const overall = (utilization * 0.2 + versatility * 0.3 + weatherMatch * 0.3 + activityMatch * 0.2);
    
    return {
      utilization,
      versatility,
      weatherMatch,
      activityMatch,
      overall
    };
  }

  private getEssentialItems(items: ClothingItem[], essentialCategories: string[]): ClothingItem[] {
    return items.filter(item => 
      essentialCategories.some(category => 
        item.category.toLowerCase().includes(category.toLowerCase()) ||
        item.subcategory.toLowerCase().includes(category.toLowerCase())
      )
    );
  }

  private selectOptionalItems(
    trip: Trip,
    items: ClothingItem[],
    capacity: { volume: number; weight: number },
    essentialItems: ClothingItem[]
  ): ClothingItem[] {
    const remainingCapacity = this.calculateRemainingCapacity(essentialItems, capacity);
    const scoredItems = items.map(item => ({
      item,
      score: this.calculateItemScore(item, trip)
    })).sort((a, b) => b.score - a.score);

    const selected: ClothingItem[] = [];
    let usedVolume = 0;
    let usedWeight = 0;

    for (const { item } of scoredItems) {
      const itemVolume = this.estimateItemVolume(item);
      const itemWeight = this.estimateItemWeight(item);

      if (usedVolume + itemVolume <= remainingCapacity.volume && 
          usedWeight + itemWeight <= remainingCapacity.weight) {
        selected.push(item);
        usedVolume += itemVolume;
        usedWeight += itemWeight;
      }
    }

    return selected;
  }

  private calculateRemainingCapacity(
    essentialItems: ClothingItem[],
    totalCapacity: { volume: number; weight: number }
  ) {
    const usedVolume = essentialItems.reduce((sum, item) => sum + this.estimateItemVolume(item), 0);
    const usedWeight = essentialItems.reduce((sum, item) => sum + this.estimateItemWeight(item), 0);

    return {
      volume: totalCapacity.volume - usedVolume,
      weight: totalCapacity.weight - usedWeight
    };
  }

  private calculateItemScore(item: ClothingItem, trip: Trip): number {
    let score = 0;
    
    score += item.formalityLevel * 0.2;
    score += item.tags.length * 0.1;
    score += item.weatherSuitability.length * 0.3;
    
    return score;
  }

  private estimateItemVolume(item: ClothingItem): number {
    const volumeMap: Record<string, number> = {
      'tops': 2,
      'bottoms': 3,
      'outerwear': 8,
      'dresses': 4,
      'shoes': 6,
      'undergarments': 0.5,
      'accessories': 1,
      'swimwear': 1,
      'sleepwear': 2,
      'athletic': 2
    };
    
    return volumeMap[item.category] || 2;
  }

  private estimateItemWeight(item: ClothingItem): number {
    const weightMap: Record<string, number> = {
      'tops': 0.3,
      'bottoms': 0.5,
      'outerwear': 1.2,
      'dresses': 0.4,
      'shoes': 0.8,
      'undergarments': 0.1,
      'accessories': 0.2,
      'swimwear': 0.2,
      'sleepwear': 0.3,
      'athletic': 0.4
    };
    
    return weightMap[item.category] || 0.3;
  }

  private calculateUtilization(items: ClothingItem[], capacity: { volume: number; weight: number }): number {
    const totalVolume = items.reduce((sum, item) => sum + this.estimateItemVolume(item), 0);
    return Math.min(totalVolume / capacity.volume, 1);
  }

  private calculateVersatility(items: ClothingItem[]): number {
    const categoryCount = new Set(items.map(item => item.category)).size;
    const maxCategories = 10;
    return Math.min(categoryCount / maxCategories, 1);
  }

  private calculateWeatherMatch(items: ClothingItem[], trip: Trip): number {
    return 0.8;
  }

  private calculateActivityMatch(items: ClothingItem[], trip: Trip): number {
    return 0.8;
  }

  private removeDuplicates(items: ClothingItem[]): ClothingItem[] {
    const seen = new Set<string>();
    return items.filter(item => {
      const key = `${item.category}-${item.subcategory}-${item.color}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
}
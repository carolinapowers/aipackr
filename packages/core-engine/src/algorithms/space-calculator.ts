import { ClothingItem, BagSize, ClothingCategory } from '@aipackr/types';

export interface SpaceUtilization {
  usedVolume: number;
  totalVolume: number;
  usedWeight: number;
  totalWeight: number;
  utilizationPercentage: number;
  recommendations: string[];
}

export interface ItemDimensions {
  volume: number;
  weight: number;
  foldable: boolean;
  compressible: boolean;
}

export class SpaceCalculator {
  private readonly bagCapacities: Record<BagSize, { volume: number; weight: number }> = {
    [BagSize.CARRY_ON]: { volume: 56, weight: 7 },
    [BagSize.CHECKED_SMALL]: { volume: 68, weight: 23 },
    [BagSize.CHECKED_MEDIUM]: { volume: 85, weight: 23 },
    [BagSize.CHECKED_LARGE]: { volume: 119, weight: 32 },
    [BagSize.BACKPACK]: { volume: 45, weight: 15 },
    [BagSize.DUFFEL]: { volume: 60, weight: 20 },
  };

  private readonly itemDimensions: Record<ClothingCategory, ItemDimensions> = {
    [ClothingCategory.TOPS]: { volume: 2, weight: 0.3, foldable: true, compressible: true },
    [ClothingCategory.BOTTOMS]: { volume: 3, weight: 0.5, foldable: true, compressible: false },
    [ClothingCategory.OUTERWEAR]: { volume: 8, weight: 1.2, foldable: true, compressible: true },
    [ClothingCategory.DRESSES]: { volume: 4, weight: 0.4, foldable: true, compressible: true },
    [ClothingCategory.SHOES]: { volume: 6, weight: 0.8, foldable: false, compressible: false },
    [ClothingCategory.UNDERGARMENTS]: { volume: 0.5, weight: 0.1, foldable: true, compressible: true },
    [ClothingCategory.ACCESSORIES]: { volume: 1, weight: 0.2, foldable: false, compressible: false },
    [ClothingCategory.SWIMWEAR]: { volume: 1, weight: 0.2, foldable: true, compressible: true },
    [ClothingCategory.SLEEPWEAR]: { volume: 2, weight: 0.3, foldable: true, compressible: true },
    [ClothingCategory.ATHLETIC]: { volume: 2, weight: 0.4, foldable: true, compressible: true },
  };

  calculateSpaceUtilization(items: ClothingItem[], bagSize: BagSize): SpaceUtilization {
    const capacity = this.bagCapacities[bagSize];
    
    const { totalVolume: usedVolume, totalWeight: usedWeight } = this.calculateTotalDimensions(items);
    
    const utilizationPercentage = Math.max(
      (usedVolume / capacity.volume) * 100,
      (usedWeight / capacity.weight) * 100
    );

    const recommendations = this.generateRecommendations(
      usedVolume,
      usedWeight,
      capacity,
      items
    );

    return {
      usedVolume,
      totalVolume: capacity.volume,
      usedWeight,
      totalWeight: capacity.weight,
      utilizationPercentage,
      recommendations
    };
  }

  calculateTotalDimensions(items: ClothingItem[]): { totalVolume: number; totalWeight: number } {
    let totalVolume = 0;
    let totalWeight = 0;

    for (const item of items) {
      const dimensions = this.getItemDimensions(item);
      totalVolume += dimensions.volume;
      totalWeight += dimensions.weight;
    }

    return { totalVolume, totalWeight };
  }

  getItemDimensions(item: ClothingItem): ItemDimensions {
    const baseDimensions = this.itemDimensions[item.category];
    
    let volumeMultiplier = 1;
    let weightMultiplier = 1;

    if (item.tags.includes('thick') || item.tags.includes('heavy')) {
      volumeMultiplier *= 1.3;
      weightMultiplier *= 1.4;
    }

    if (item.tags.includes('light') || item.tags.includes('thin')) {
      volumeMultiplier *= 0.8;
      weightMultiplier *= 0.7;
    }

    if (item.brand && ['premium', 'luxury'].some(tag => item.tags.includes(tag))) {
      weightMultiplier *= 1.1;
    }

    return {
      ...baseDimensions,
      volume: baseDimensions.volume * volumeMultiplier,
      weight: baseDimensions.weight * weightMultiplier,
    };
  }

  optimizeSpaceUsage(items: ClothingItem[]): ClothingItem[] {
    const sortedItems = [...items].sort((a, b) => {
      const aDimensions = this.getItemDimensions(a);
      const bDimensions = this.getItemDimensions(b);
      
      const aEfficiency = this.calculateSpaceEfficiency(a);
      const bEfficiency = this.calculateSpaceEfficiency(b);
      
      return bEfficiency - aEfficiency;
    });

    return sortedItems;
  }

  private calculateSpaceEfficiency(item: ClothingItem): number {
    const dimensions = this.getItemDimensions(item);
    const versatilityScore = item.tags.length + item.weatherSuitability.length;
    
    return versatilityScore / (dimensions.volume + dimensions.weight);
  }

  private generateRecommendations(
    usedVolume: number,
    usedWeight: number,
    capacity: { volume: number; weight: number },
    items: ClothingItem[]
  ): string[] {
    const recommendations: string[] = [];
    
    const volumeUtilization = usedVolume / capacity.volume;
    const weightUtilization = usedWeight / capacity.weight;

    if (volumeUtilization > 0.9) {
      recommendations.push('Your bag is nearly at volume capacity. Consider compression packing cubes.');
    } else if (volumeUtilization < 0.5) {
      recommendations.push('You have plenty of space left. Consider adding versatile items.');
    }

    if (weightUtilization > 0.9) {
      recommendations.push('Your bag is nearly at weight capacity. Consider lighter alternatives.');
    }

    const compressibleItems = items.filter(item => 
      this.getItemDimensions(item).compressible
    ).length;

    if (compressibleItems > 3) {
      recommendations.push('Use compression packing cubes to save 20-30% space on soft items.');
    }

    const shoeCount = items.filter(item => item.category === ClothingCategory.SHOES).length;
    if (shoeCount > 2) {
      recommendations.push('Consider limiting shoes to 2 pairs and wearing the heaviest pair while traveling.');
    }

    const outerwearCount = items.filter(item => item.category === ClothingCategory.OUTERWEAR).length;
    if (outerwearCount > 1) {
      recommendations.push('Wear your heaviest coat/jacket while traveling to save space.');
    }

    if (recommendations.length === 0) {
      recommendations.push('Your packing looks well-optimized for the chosen bag size.');
    }

    return recommendations;
  }

  suggestBagSize(items: ClothingItem[]): BagSize {
    const { totalVolume, totalWeight } = this.calculateTotalDimensions(items);
    
    const suitableBags = Object.entries(this.bagCapacities)
      .filter(([_, capacity]) => 
        totalVolume <= capacity.volume * 0.85 && 
        totalWeight <= capacity.weight * 0.85
      )
      .map(([bagSize, _]) => bagSize as BagSize);

    if (suitableBags.length === 0) {
      return BagSize.CHECKED_LARGE;
    }

    const bagSizeOrder = [
      BagSize.CARRY_ON,
      BagSize.BACKPACK,
      BagSize.DUFFEL,
      BagSize.CHECKED_SMALL,
      BagSize.CHECKED_MEDIUM,
      BagSize.CHECKED_LARGE,
    ];

    for (const bagSize of bagSizeOrder) {
      if (suitableBags.includes(bagSize)) {
        return bagSize;
      }
    }

    return BagSize.CHECKED_MEDIUM;
  }
}
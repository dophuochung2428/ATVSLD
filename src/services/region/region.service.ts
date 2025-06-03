import { Injectable } from '@nestjs/common';
import regions from '../../data/regions.json';
import { Level1 } from './region.interface';

@Injectable()
export class RegionService {
  private regions: Level1[] = regions;

  getLevel1Name(level1Id: string): string | null {
    const level1 = this.regions.find(l1 => l1.level1_id === level1Id);
    return level1?.name || null;
  }

  getLevel2Name(level1Id: string, level2Id: string): string | null {
    const level1 = this.regions.find(l1 => l1.level1_id === level1Id);
    const level2 = level1?.level2s.find(l2 => l2.level2_id === level2Id);
    return level2?.name || null;
  }

  getLevel3Name(level1Id: string, level2Id: string, level3Id: string): string | null {
    const level1 = this.regions.find(l1 => l1.level1_id === level1Id);
    const level2 = level1?.level2s.find(l2 => l2.level2_id === level2Id);
    const level3 = level2?.level3s.find(l3 => l3.level3_id === level3Id);
    return level3?.name || null;
  }

  getFullRegionName(level1Id: string, level2Id: string, level3Id: string): string {
    const l1 = this.getLevel1Name(level1Id);
    const l2 = this.getLevel2Name(level1Id, level2Id);
    const l3 = this.getLevel3Name(level1Id, level2Id, level3Id);
    return [l3, l2, l1].filter(Boolean).join(', ');
  }


  getRegionIdsByNames(level1Name: string, level2Name: string, level3Name: string): {
    level1Id: string | null,
    level2Id: string | null,
    level3Id: string | null,
  } {
    const level1 = this.regions.find((l1) => l1.name === level1Name);
    const level2 = level1?.level2s.find((l2) => l2.name === level2Name);
    const level3 = level2?.level3s.find((l3) => l3.name === level3Name);

    return {
      level1Id: level1?.level1_id ?? null,
      level2Id: level2?.level2_id ?? null,
      level3Id: level3?.level3_id ?? null,
    };
  }

}

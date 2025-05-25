import regions from '../../../../src/data/regions.json';

export const REGION_LEVEL1_IDS = regions.map(r => r.level1_id);  // Chỉ lấy ID
export const REGION_LEVEL1_LABELS = regions.map(r => `${r.level1_id} - ${r.name}`);  // Chuỗi hiển thị

export const REGION_LEVEL2_IDS = regions.flatMap(r => r.level2s.map(l2 => l2.level2_id));
export const REGION_LEVEL2_LABELS = regions.flatMap(r => r.level2s.map(l2 => `${l2.level2_id} - ${l2.name}`));

export const REGION_LEVEL3_IDS = regions.flatMap(r => r.level2s.flatMap(l2 => l2.level3s.map(l3 => l3.level3_id)));
export const REGION_LEVEL3_LABELS = regions.flatMap(r => r.level2s.flatMap(l2 => l2.level3s.map(l3 => `${l3.level3_id} - ${l3.name}`)));


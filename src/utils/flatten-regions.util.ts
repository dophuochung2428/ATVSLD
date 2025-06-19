import { RegionsMap } from "src/services/report-period/report-period.service.interface";


export function flattenRegions(raw: any[]): RegionsMap {
  const map: RegionsMap = {};

  for (const l1 of raw) {
    map[l1.level1_id] = { name: l1.name };
    for (const l2 of l1.level2s || []) {
      map[l2.level2_id] = { name: l2.name };
      for (const l3 of l2.level3s || []) {
        map[l3.level3_id] = { name: l3.name };
      }
    }
  }

  return map;
}

import { Department } from 'src/entities/department.entity';
import { Report } from 'src/entities/report.entity';
import { BusinessTypeLabels } from 'src/enums/business-type.labels';
import { reportFieldMap } from 'src/services/report-period/report-export.map';
import { ExportReportData, RegionsMap, ExportFieldValue } from 'src/services/report-period/report-period.service.interface';

/**
 * Truy xuất giá trị trong object bằng đường dẫn dạng chuỗi "a.b.c"
 */
export function getValueFromPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce((acc, key) => {
    if (typeof acc === 'object' && acc !== null) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

/**
 * Thay thế tất cả giá trị null/undefined bằng chuỗi rỗng ""
 */
export function cleanNulls(data: ExportReportData): ExportReportData {
  const result: ExportReportData = {};
  for (const key in data) {
    const value = data[key as keyof ExportReportData];
    result[key as keyof ExportReportData] = value ?? '';
  }
  return result;
}

/**
 * Gộp địa chỉ từ các cấp vùng và địa chỉ chi tiết
 */
export function buildFullAddress(
  department: Department,
  regions: RegionsMap
): string {
  const l1 = regions[department.region_level1_id]?.name || '';
  const l2 = regions[department.region_level2_id]?.name || '';
  const l3 = regions[department.region_level3_id]?.name || '';
  const addr = department.address || '';
  return [addr, l3, l2, l1].filter(Boolean).join(', ');
}

/**
 * Sinh dữ liệu xuất Word từ Report + Regions
 */
export function getReportExportData(
  report: Report,
  regions: RegionsMap
): ExportReportData {
  const result: ExportReportData = {};

  for (const key in reportFieldMap) {
    const path = reportFieldMap[key as keyof ExportReportData];

    if (!path) continue;

    const raw = getValueFromPath(report, path);

    if (key === 'businessTypeName') {
      result[key as keyof ExportReportData] = BusinessTypeLabels[raw as keyof typeof BusinessTypeLabels] ?? '';
    } else if (key === 'address') {
      result[key as keyof ExportReportData] = buildFullAddress(report.department, regions);
    } else {
      result[key as keyof ExportReportData] = (raw ?? '') as ExportFieldValue;
    }
  }

  return result;
}

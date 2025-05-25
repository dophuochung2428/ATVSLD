import { BusinessType } from './businessType.enum';

export const BusinessTypeLabels: Record<BusinessType, string> = {
  [BusinessType.PRIVATE]: 'Doanh nghiệp tư nhân',
  [BusinessType.STATE]: 'Doanh nghiệp nhà nước',
  [BusinessType.FDI]: 'DN có vốn đầu tư nước ngoài (FDI)',
  [BusinessType.LIMITED]: 'Công ty TNHH',
  [BusinessType.PARTNERSHIP]: 'Công ty hợp danh',
  [BusinessType.OTHER]: 'Loại hình khác',
};

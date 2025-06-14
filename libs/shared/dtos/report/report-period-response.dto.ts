import { Period } from 'src/enums/period.enum';
import { ReportName } from 'src/enums/reportName.enum';

export class ReportPeriodResponseDto {
  id: string;
  year: number;
  name: ReportName;
  reportPeriodNameLabel: string;
  period: Period;
  periodLabel: string;
  startDate: Date;
  endDate: Date;
  active: boolean;
}

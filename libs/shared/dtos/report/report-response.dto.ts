import { Period } from "src/enums/period.enum";
import { ReportState } from "src/enums/report-state.enum";

export class ReportResponseDto {
  id: string;
  state: ReportState;
  stateLabel: string;   
  departmentName: string;
  startDate: Date;
  endDate: Date;
  period: Period;
  reportPeriodName: string;
  updateDate: Date;
  userName?: string;
}

import { Period } from "src/enums/period.enum";
import { ReportState } from "src/enums/report-state.enum";
import { ReportName } from "src/enums/reportName.enum";

export class ReportResponseDto {
  id: string;
  state: ReportState;
  stateLabel: string;   
  departmentName: string;
  startDate: Date;
  endDate: Date;
  period: Period;
  reportPeriodName: ReportName;
  updateDate: Date;
  userName?: string;
}

import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ReportState } from 'src/enums/report-state.enum';

export class CreateReportDto {
  @IsString()
  departmentId: string;

  @IsString()
  reportPeriodId: string;

  @IsEnum(ReportState)
  @IsOptional()
  state?: ReportState;
}
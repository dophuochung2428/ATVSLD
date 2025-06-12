import { CreateReportPeriodDto } from '@shared/dtos/report/create-report-period.dto';
import { ReportResponseDto } from '@shared/dtos/report/report-response.dto';
import { UpdateReportPeriodDto } from '@shared/dtos/report/update-report-period.dto';
import { ReportPeriod } from 'src/entities/report-period.entity';

export interface IReportPeriodService {
  create(dto: CreateReportPeriodDto): Promise<ReportPeriod>;
  findAll(): Promise<ReportPeriod[]>;
  findOne(id: string): Promise<ReportPeriod>;
  update(id: string, dto: UpdateReportPeriodDto): Promise<ReportPeriod>;
  toggleStatus(id: string): Promise<void>
}


export interface IReportService {
  getReportsByDepartment(departmentId: string): Promise<ReportResponseDto[]>
}

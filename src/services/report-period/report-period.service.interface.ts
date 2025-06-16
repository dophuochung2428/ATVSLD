import { CreateReportPeriodDto } from '@shared/dtos/report/create-report-period.dto';
import { CreateReportDto } from '@shared/dtos/report/create-report.dto';
import { ReportPeriodResponseDto } from '@shared/dtos/report/report-period-response.dto';
import { ReportResponseDto } from '@shared/dtos/report/report-response.dto';
import { UpdateReportPeriodDto } from '@shared/dtos/report/update-report-period.dto';
import { ReportPeriod } from 'src/entities/report-period.entity';
import { Report } from 'src/entities/report.entity';

export interface IReportPeriodService {
  create(dto: CreateReportPeriodDto): Promise<ReportPeriod>;
  findAll(): Promise<ReportPeriodResponseDto[]>;
  findOne(id: string): Promise<ReportPeriodResponseDto>;
  update(id: string, dto: UpdateReportPeriodDto): Promise<ReportPeriod>;
  toggleStatus(id: string): Promise<void>
  deleteMany(ids: string[]): Promise<void>
  getAllRelevantReportPeriods(): Promise<ReportPeriodResponseDto[]>
}


export interface IReportService {
  getReportsByDepartment(departmentId: string): Promise<ReportResponseDto[]>
  getReportsByPeriodYear(departmentId: string, year: number): Promise<ReportResponseDto[]>
  createReport(dto: CreateReportDto): Promise<Report>
}

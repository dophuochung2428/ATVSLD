import { CreateReportPeriodDto } from '@shared/dtos/report/create-report-period.dto';
import { CreateReportDto } from '@shared/dtos/report/create-report.dto';
import { ReportPeriodResponseDto } from '@shared/dtos/report/report-period-response.dto';
import { ReportResponseDto } from '@shared/dtos/report/report-response.dto';
import { ReviewReportDto } from '@shared/dtos/report/review-report.dto';
import { UpdateReportPeriodDto } from '@shared/dtos/report/update-report-period.dto';
import { UpdateReportInfosDto } from '@shared/dtos/report/update-reportInfo.dto';
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
  checkYearExists(year: number): Promise<boolean>
  getActiveYears(departmentId: string): Promise<number[]>
}


export interface IReportService {
  getReportsByDepartment(departmentId: string): Promise<ReportResponseDto[]>
  getReportsByPeriodYear(departmentId: string, year: number): Promise<ReportResponseDto[]>
  createReport(dto: CreateReportDto): Promise<Report>
  markReportsAsExpired(): Promise<void>
  updateReportInfos(reportId: string, dto: UpdateReportInfosDto, userId: string, markComplete?: boolean): Promise<void>
  startTyping(reportId: string, userId: string): Promise<void>
  findByIdWithRelations(reportId: string): Promise<Report>
  reviewReport(id: string, dto: ReviewReportDto)
  getReportsWaitingForApproval(): Promise<ReportResponseDto[]>
}

export type ExportFieldValue = string | number | undefined;
export interface ExportReportDataBase {
  yearOfPeriod?: ExportFieldValue;
  nameOfDepartment?: ExportFieldValue;
  businessIndustryCode?: ExportFieldValue;
  businessTypeName?: ExportFieldValue;
  address?: ExportFieldValue;
  phone?: ExportFieldValue;
  year?: ExportFieldValue;
  month?: ExportFieldValue;
  day?: ExportFieldValue;
}

export type ExportReportData = ExportReportDataBase & {
  [key in
  | `a${number}`
  | `b${number}`
  | `c${number}`
  | `d${number}`
  | `e${number}`
  | `f${number}`
  | `g${number}`
  | `h${number}`
  | `i${number}`
  | `k${number}`
  | `l${number}`
  | `m${number}`
  ]?: ExportFieldValue;
};

export type RegionsMap = Record<string, { name: string }>;

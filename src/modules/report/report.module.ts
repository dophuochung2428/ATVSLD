import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportPeriodController } from 'src/controllers/report-period.controller';
import { ReportController } from 'src/controllers/report.controller';
import { Department } from 'src/entities/department.entity';
import { ReportPeriod } from 'src/entities/report-period.entity';
import { Report } from 'src/entities/report.entity';
import { User } from 'src/entities/user.entity';
import { ExportReportService } from 'src/services/report-period/export-report.service';
import { ReportPeriodService, ReportService } from 'src/services/report-period/report-period.service';


@Module({
  imports: [TypeOrmModule.forFeature([ReportPeriod, Report, Department, User])],
  controllers: [ReportPeriodController, ReportController],
  providers: [
    { provide: 'IReportPeriodService', useClass: ReportPeriodService, },
    { provide: 'IReportService', useClass: ReportService, },
    ExportReportService,
  ],
  exports: ['IReportPeriodService', 'IReportService'],
})
export class ReportPeriodModule { }

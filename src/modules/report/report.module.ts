import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportPeriodController } from 'src/controllers/report-period.controller';
import { Department } from 'src/entities/department.entity';
import { ReportPeriod } from 'src/entities/report-period.entity';
import { Report } from 'src/entities/report.entity';
import { ReportPeriodService } from 'src/services/report-period/report-period.service';


@Module({
  imports: [TypeOrmModule.forFeature([ReportPeriod, Report, Department])],
  controllers: [ReportPeriodController],
  providers: [
    {
      provide: 'IReportPeriodService',
      useClass: ReportPeriodService,
    }],
  exports: ['IReportPeriodService'],
})
export class ReportPeriodModule { }

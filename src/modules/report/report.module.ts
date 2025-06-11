import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportPeriodController } from 'src/controllers/report-period.controller';
import { ReportPeriod } from 'src/entities/report-period.entity';
import { ReportPeriodService } from 'src/services/report-period/report-period.service';


@Module({
  imports: [TypeOrmModule.forFeature([ReportPeriod])],
  controllers: [ReportPeriodController],
  providers: [ReportPeriodService],
})
export class ReportPeriodModule {}

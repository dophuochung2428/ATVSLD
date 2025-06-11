import { PartialType } from '@nestjs/mapped-types';
import { CreateReportPeriodDto } from './create-report-period.dto';

export class UpdateReportPeriodDto extends PartialType(CreateReportPeriodDto) {}

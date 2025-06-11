import { Controller, Get, Post, Body, Put, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateReportPeriodDto } from '@shared/dtos/report/create-report-period.dto';
import { UpdateReportPeriodDto } from '@shared/dtos/report/update-report-period.dto';
import { ReportPeriodService } from 'src/services/report-period/report-period.service';

@ApiTags('Kỳ báo cáo')
@Controller('report-periods')
export class ReportPeriodController {
  constructor(
    private readonly reportPeriodService: ReportPeriodService) {}

      @ApiOperation({ summary: 'Tạo kỳ báo cáo' })
  @Post()
  create(@Body() dto: CreateReportPeriodDto) {
    return this.reportPeriodService.create(dto);
  }

  @Get()
   @ApiOperation({ summary: 'Lấy danh sách kỳ báo cáo' })
  findAll() {
    return this.reportPeriodService.findAll();
  }


  @Get(':id')
      @ApiOperation({ summary: 'Lấy chi tiết kỳ báo cáo' })
  @ApiParam({ name: 'id', description: 'ID kỳ báo cáo' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.reportPeriodService.findOne(id);
  }

  @Put(':id')
    @ApiOperation({ summary: 'Cập nhật kỳ báo cáo' })
  @ApiParam({ name: 'id', description: 'ID kỳ báo cáo cần cập nhật' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateReportPeriodDto) {
    return this.reportPeriodService.update(id, dto);
  }

}

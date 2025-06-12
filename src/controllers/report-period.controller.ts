import { Controller, Get, Post, Body, Put, Param, Delete, ParseUUIDPipe, UseGuards, Inject, Patch, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateReportPeriodDto } from '@shared/dtos/report/create-report-period.dto';
import { UpdateReportPeriodDto } from '@shared/dtos/report/update-report-period.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';
import { IReportPeriodService } from 'src/services/report-period/report-period.service.interface';

@ApiTags('Report Period')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('report-periods')
export class ReportPeriodController {
  constructor(
    @Inject('IReportPeriodService')
    private readonly reportPeriodService: IReportPeriodService) { }

  @ApiOperation({ summary: 'Tạo kỳ báo cáo' })
  @ApiBody({ type: CreateReportPeriodDto })
  @Post()
  async create(@Body() dto: CreateReportPeriodDto) {
    return this.reportPeriodService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách kỳ báo cáo' })
  async findAll() {
    return this.reportPeriodService.findAll();
  }


  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết kỳ báo cáo' })
  @ApiParam({ name: 'id', description: 'ID kỳ báo cáo' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.reportPeriodService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật kỳ báo cáo' })
  @ApiBody({ type: UpdateReportPeriodDto })
  @ApiParam({ name: 'id', description: 'ID kỳ báo cáo cần cập nhật' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateReportPeriodDto) {
    return this.reportPeriodService.update(id, dto);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Toggle trạng thái (active/inactive) của kì báo cáo' })
  @ApiParam({ name: 'id', type: String, description: 'ID của kì báo cáo cần đổi trạng thái' })
  async toggleUserStatus(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.reportPeriodService.toggleStatus(id);
  }

}

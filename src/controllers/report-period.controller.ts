import { Controller, Get, Post, Body, Put, Param, Delete, ParseUUIDPipe, UseGuards, Inject, Patch, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateReportPeriodDto } from '@shared/dtos/report/create-report-period.dto';
import { UpdateReportPeriodDto } from '@shared/dtos/report/update-report-period.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';
import { Permissions } from 'src/modules/auth/permissions.decorator';
import { IReportPeriodService } from 'src/services/report-period/report-period.service.interface';

@ApiTags('Report Period(Quản trị hệ thống quản lý kì báo cáo)')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('report-periods')
export class ReportPeriodController {
  constructor(
    @Inject('IReportPeriodService')
    private readonly reportPeriodService: IReportPeriodService) { }

  @Permissions('ADMIN_C_REPORT_CREATE')
  @ApiOperation({ summary: 'Tạo kỳ báo cáo' })
  @ApiBody({ type: CreateReportPeriodDto })
  @Post()
  async create(@Body() dto: CreateReportPeriodDto) {
    return this.reportPeriodService.create(dto);
  }

  @Permissions('ADMIN_C_REPORT_VIEW')
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách kỳ báo cáo' })
  async findAll() {
    return this.reportPeriodService.findAll();
  }

  @Permissions('ADMIN_C_REPORT_VIEW')
  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết kỳ báo cáo' })
  @ApiParam({ name: 'id', description: 'ID kỳ báo cáo' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.reportPeriodService.findOne(id);
  }

  @Permissions('ADMIN_C_REPORT_UPDATE')
  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật kỳ báo cáo' })
  @ApiBody({ type: UpdateReportPeriodDto })
  @ApiParam({ name: 'id', description: 'ID kỳ báo cáo cần cập nhật' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateReportPeriodDto) {
    return this.reportPeriodService.update(id, dto);
  }

  @Permissions('ADMIN_C_REPORT_UPDATE')
  @Patch(':id/status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Toggle trạng thái (active/inactive) của kì báo cáo' })
  @ApiParam({ name: 'id', type: String, description: 'ID của kì báo cáo cần đổi trạng thái' })
  async toggleUserStatus(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.reportPeriodService.toggleStatus(id);
  }

  @Delete()
  @ApiOperation({ summary: 'Xóa những report được chọn' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ids: {
          type: 'array',
          items: { type: 'string' },
          example: ['id1', 'id2']
        },
      },
      required: ['ids'],
    }
  })
  async deleteMany(@Body('ids') ids: string[]): Promise<void> {
    return this.reportPeriodService.deleteMany(ids);
  }


}

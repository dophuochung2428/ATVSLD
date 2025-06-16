import { Controller, Get, Post, Body, Put, Param, Delete, ParseUUIDPipe, UseGuards, Inject, Patch, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ReportResponseDto } from '@shared/dtos/report/report-response.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';
import { Permissions } from 'src/modules/auth/permissions.decorator';
import { IReportService } from 'src/services/report-period/report-period.service.interface';

@ApiTags('Report(Báo cáo của doanh nghiệp)')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('report')
export class ReportController {
    constructor(
        @Inject('IReportService')
        private readonly reportService: IReportService) { }

    @Permissions('USER_C_REPORT_VIEW')
    @Get()
    @ApiOperation({ summary: 'Lấy thông tin báo cáo của doanh nghiệp' })
    async getByDepartment(
        @Query('departmentId') departmentId: string,
    ): Promise<ReportResponseDto[]> {
        return this.reportService.getReportsByDepartment(departmentId);
    }

    @Permissions('USER_C_REPORT_VIEW')
    @Get('by-report-year/:year')
    @ApiOperation({ summary: 'Lấy thông tin báo cáo của doanh nghiệp theo năm' })
    getReportsByReportPeriodYear(@Param('year') year: string) {
        return this.reportService.getReportsByPeriodYear(Number(year));
    }


}

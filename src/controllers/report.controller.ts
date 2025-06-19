import { Controller, Get, Post, Body, Put, Param, Delete, ParseUUIDPipe, UseGuards, Inject, Patch, HttpCode, HttpStatus, Query, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ReportResponseDto } from '@shared/dtos/report/report-response.dto';
import { UpdateReportInfosDto } from '@shared/dtos/report/update-reportInfo.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';
import { Permissions } from 'src/modules/auth/permissions.decorator';
import { ExportReportService } from 'src/services/report-period/export-report.service';
import { IReportService } from 'src/services/report-period/report-period.service.interface';
import { getReportExportData } from '../utils/report-export.util';
import rawRegions from 'src/data/regions.json'; 
import { flattenRegions } from '../utils/flatten-regions.util';
import { Response } from 'express';


@ApiTags('Report(Báo cáo của doanh nghiệp)')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('report')
export class ReportController {
    constructor(
        @Inject('IReportService')
        private readonly reportService: IReportService,

        private readonly exportReportService: ExportReportService,
    ) { }

    @Permissions('USER_C_REPORT_VIEW')
    @Get()
    @ApiOperation({ summary: 'Lấy thông tin báo cáo của doanh nghiệp' })
    async getByDepartment(
        @Query('departmentId', ParseUUIDPipe) departmentId: string,
    ): Promise<ReportResponseDto[]> {
        return this.reportService.getReportsByDepartment(departmentId);
    }

    @Permissions('USER_C_REPORT_VIEW')
    @Get('by-department/:departmentId/year/:year')
    @ApiOperation({ summary: 'Lấy thông tin báo cáo của doanh nghiệp theo năm' })
    getReportsByReportPeriodYear(
        @Param('departmentId', ParseUUIDPipe) departmentId: string,
        @Param('year') year: string
    ) {
        return this.reportService.getReportsByPeriodYear(departmentId, Number(year));
    }

    @Post('cron/expire-reports')
    @HttpCode(200)
    async expirePendingReports() {
        await this.reportService.markReportsAsExpired();
        return { message: 'Đã kiểm tra và chuyển trạng thái báo cáo quá hạn.' };
    }

    @Put(':id/infos')
    async updateReportInfos(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateReportInfosDto,
        @Query('userId', ParseUUIDPipe) userId: string,
    ) {
        await this.reportService.updateReportInfos(id, dto, userId);
    }

    @Put(':id/complete')
    async completeReport(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateReportInfosDto,
        @Query('userId', ParseUUIDPipe) userId: string,
    ) {
        await this.reportService.updateReportInfos(id, dto, userId, true); // true = mark complete
    }



    @Patch(':id/start-typing')
    @ApiOperation({ summary: 'Bắt đầu chỉnh sửa báo cáo (chuyển trạng thái từ Pending sang Typing)' })
    @ApiParam({ name: 'id', description: 'ID của báo cáo' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'string', example: 'uuid-user-id' },
            },
            required: ['userId'],
        }
    })
    async startTyping(
        @Param('id', ParseUUIDPipe) reportId: string,
        @Body('userId', ParseUUIDPipe) userId: string,
    ): Promise<void> {
        await this.reportService.startTyping(reportId, userId);
    }

    @Get(':id/preview')
    async previewReport(@Param('id') reportId: string, @Res() res: Response) {
        const regions = flattenRegions(rawRegions);
        const report = await this.reportService.findByIdWithRelations(reportId);
        const data = getReportExportData(report, regions);
        const buffer = await this.exportReportService.exportReportWord(data);

        res.set({
            'Content-Type':
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition': `inline; filename=report-${reportId}.docx`,
        });

        res.end(buffer);
    }

}

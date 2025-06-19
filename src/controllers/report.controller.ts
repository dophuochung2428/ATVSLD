import { Controller, Get, Post, Body, Put, Param, Delete, ParseUUIDPipe, UseGuards, Inject, Patch, HttpCode, HttpStatus, Query, Res, NotFoundException, HttpException, BadRequestException } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
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
import { StreamableFile } from '@nestjs/common';


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
    @ApiOperation({ summary: 'Cập nhật báo cáo( Báo cáo)' })

    async updateReportInfos(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateReportInfosDto,
        @Query('userId', ParseUUIDPipe) userId: string,
    ) {
        await this.reportService.updateReportInfos(id, dto, userId);
    }

    @Put(':id/complete')
    @ApiOperation({ summary: 'Hoàn thành' })

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
    @ApiProduces('application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    @ApiOperation({ summary: 'Tạo báo cáo bản word' })

    @ApiResponse({
        status: 200,
        description: 'Export report as Word document',
        schema: {
            type: 'string',
            format: 'binary',
        },
    })
    async previewReport(@Param('id', ParseUUIDPipe) reportId: string): Promise<StreamableFile> {
        try {
            console.log(`Bắt đầu xử lý preview cho report ID: ${reportId}`);
            const regions = flattenRegions(rawRegions);
            const report = await this.reportService.findByIdWithRelations(reportId);
            if (!report) {
                console.log(`Không tìm thấy báo cáo với ID: ${reportId}`);
                throw new NotFoundException(`Không tìm thấy báo cáo với ID ${reportId}`);
            }
            const data = getReportExportData(report, regions);
            const buffer = await this.exportReportService.exportReportWord(data);
            console.log(`Buffer được tạo, kích thước: ${buffer.length} bytes`);
            if (!(buffer instanceof Buffer) || buffer.length === 0) {
                console.error('Lỗi: Buffer không hợp lệ hoặc rỗng');
                throw new HttpException('Buffer không hợp lệ', HttpStatus.INTERNAL_SERVER_ERROR);
            }
            console.log(`Đang trả về StreamableFile cho report ID: ${reportId}`);
            return new StreamableFile(buffer, {
                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                disposition: `attachment; filename=report-${reportId}.docx`,
            });


        } catch (error) {
            console.error(`Lỗi trong previewReport: ${error.message}`);
            if (error instanceof BadRequestException) {
                throw new HttpException('Định dạng UUID không hợp lệ', HttpStatus.BAD_REQUEST);
            }
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException('Lỗi máy chủ nội bộ', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    @ApiParam({ name: 'id', description: 'ID của báo cáo' })
    @ApiOperation({ summary: 'Lấy chi tiết báo cáo' })
    async getReportDetail(@Param('id', ParseUUIDPipe) id: string) {
        return this.reportService.findByIdWithRelations(id);
    }


}

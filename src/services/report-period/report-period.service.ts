import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReportPeriodDto } from '@shared/dtos/report/create-report-period.dto';
import { UpdateReportPeriodDto } from '@shared/dtos/report/update-report-period.dto';
import { Department } from 'src/entities/department.entity';
import { ReportPeriod } from 'src/entities/report-period.entity';
import { Report } from 'src/entities/report.entity';
import { ReportState, ReportStateLabel } from 'src/enums/report-state.enum';
import { DataSource, LessThanOrEqual, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { IReportPeriodService, IReportService } from './report-period.service.interface';
import { ReportResponseDto } from '@shared/dtos/report/report-response.dto';
import { PeriodLabel } from 'src/enums/period.enum';
import { ReportNameLabel } from 'src/enums/reportName.enum';
import { ReportPeriodResponseDto } from '@shared/dtos/report/report-period-response.dto';


@Injectable()
export class ReportPeriodService implements IReportPeriodService {
    constructor(
        @InjectRepository(ReportPeriod)
        private readonly repo: Repository<ReportPeriod>,

        @InjectRepository(Report)
        private readonly reportRepo: Repository<Report>,

        @InjectRepository(Department)
        private readonly departmentRepo: Repository<Department>,

        private readonly dataSource: DataSource,
    ) { }

    async create(dto: CreateReportPeriodDto): Promise<ReportPeriod> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            if (!dto.startDate || isNaN(new Date(dto.startDate).getTime())) {
                throw new BadRequestException('Ngày bắt đầu không hợp lệ');
            }

            if (!dto.endDate || isNaN(new Date(dto.endDate).getTime())) {
                throw new BadRequestException('Ngày kết thúc không hợp lệ');
            }
            const start = new Date(dto.startDate);
            const end = new Date(dto.endDate);

            if (start > end) {
                throw new BadRequestException('Ngày bắt đầu phải trước hoặc bằng ngày kết thúc');
            }

            const overlap = await queryRunner.manager.findOne(ReportPeriod, {
                where: {
                    startDate: LessThanOrEqual(end),
                    endDate: MoreThanOrEqual(start),
                },
            });

            if (overlap) {
                throw new BadRequestException('Đã tồn tại kỳ báo cáo trùng hoặc giao nhau');
            }

            // Tạo kỳ báo cáo
            const period = queryRunner.manager.create(ReportPeriod, dto);
            const savedPeriod = await queryRunner.manager.save(ReportPeriod, period);

            // Lấy doanh nghiệp
            const departments = await queryRunner.manager.find(Department);

            // Tạo danh sách báo cáo
            const reports = departments.map((dept) =>
                queryRunner.manager.create(Report, {
                    department: dept,
                    // startDate: savedPeriod.startDate,
                    // endDate: savedPeriod.endDate,
                    // period: savedPeriod.period,
                    updateDate: null,
                    state: ReportState.Pending,
                    reportPeriod: savedPeriod,
                    user: null,
                }),
            );

            await queryRunner.manager.save(Report, reports);

            //  Commit nếu không lỗi
            await queryRunner.commitTransaction();
            return savedPeriod;
        } catch (error) {
            // Rollback nếu lỗi
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            //  Giải phóng kết nối
            await queryRunner.release();
        }
    }

    async findAll(): Promise<ReportPeriodResponseDto[]> {
        const periods = await this.repo.find();

        return periods.map(period => ({
            id: period.id,
            year: period.year,
            name: period.name,
            reportPeriodNameLabel: ReportNameLabel[period.name],
            period: period.period,
            periodLabel: PeriodLabel[period.period],
            startDate: period.startDate,
            endDate: period.endDate,
            active: period.active,
        }));
    }

    async findOne(id: string): Promise<ReportPeriodResponseDto> {
        const period = await this.repo.findOne({ where: { id } });
        if (!period) throw new NotFoundException('Report period not found');
        return {
            id: period.id,
            year: period.year,
            name: period.name,
            reportPeriodNameLabel: ReportNameLabel[period.name],
            period: period.period,
            periodLabel: PeriodLabel[period.period],
            startDate: period.startDate,
            endDate: period.endDate,
            active: period.active,
        };
    }

    async update(id: string, dto: UpdateReportPeriodDto): Promise<ReportPeriod> {
        const period = await this.findOne(id);

        const newStart = dto.startDate ? new Date(dto.startDate) : period.startDate;
        const newEnd = dto.endDate ? new Date(dto.endDate) : period.endDate;

        if (newStart > newEnd) {
            throw new BadRequestException('Ngày bắt đầu phải trước hoặc bằng ngày kết thúc');
        }

        const fieldsToUpdate: Partial<ReportPeriod> = {};
        if (dto.startDate) fieldsToUpdate.startDate = new Date(dto.startDate);
        if (dto.endDate) fieldsToUpdate.endDate = new Date(dto.endDate);
        if (dto.active !== undefined) fieldsToUpdate.active = dto.active;

        if (dto.startDate && dto.endDate) {
            // Check xem có kỳ khác giao nhau không
            const overlap = await this.repo.findOne({
                where: {
                    id: Not(id),
                    startDate: LessThanOrEqual(newEnd),
                    endDate: MoreThanOrEqual(newStart),
                },
            });
            if (overlap) {
                throw new BadRequestException('Đã tồn tại kỳ báo cáo khác trùng hoặc giao nhau');
            }
        }


        Object.assign(period, fieldsToUpdate);
        const updatedPeriod = await this.repo.save(period);

        if (dto.startDate && dto.endDate) {
            const submittedCount = await this.reportRepo.count({
                where: {
                    reportPeriod: { id },
                    state: Not(ReportState.Pending),
                },
            });
            if (submittedCount > 0) {
                throw new BadRequestException('Không thể thay đổi ngày nếu đã có báo cáo được nộp');
            }
        }
        return updatedPeriod;
    }

    async toggleStatus(id: string): Promise<void> {
        const reportPeriod = await this.repo.findOne({
            where: { id },
        });
        if (!reportPeriod) {
            throw new NotFoundException(`Không tìm thấy kì báo cáo nào với id:  ${id} `);
        }

        reportPeriod.active = !reportPeriod.active;

        await this.repo.save(reportPeriod);
    }

    async getAllRelevantReportPeriods(): Promise<ReportPeriodResponseDto[]> {
        const currentDate = new Date();
        const periods = await this.repo
            .createQueryBuilder('period')
            .where('period.startDate <= :currentDate AND period.endDate >= :currentDate', { currentDate })
            .andWhere('period.active = :active', { active: true }) 
            .getMany();

        return periods.map((period) => ({
            id: period.id,
            year: period.year,
            name: period.name,
            reportPeriodNameLabel: ReportNameLabel[period.name],
            period: period.period,
            periodLabel: PeriodLabel[period.period],
            startDate: period.startDate,
            endDate: period.endDate,
            active: period.active,
        }));
    }

    async deleteMany(ids: string[]): Promise<void> {
        if (!ids || ids.length === 0) {
            throw new BadRequestException('Không có kỳ báo cáo nào được chọn để xoá');
        }

        await this.repo.delete(ids);
    }

}




@Injectable()
export class ReportService implements IReportService {
    constructor(
        @InjectRepository(ReportPeriod)
        private readonly repo: Repository<ReportPeriod>,

        @InjectRepository(Report)
        private readonly reportRepo: Repository<Report>,

    ) { }

    async getReportsByDepartment(departmentId: string): Promise<ReportResponseDto[]> {
        const reports = await this.reportRepo.find({
            where: { department: { id: departmentId } },
            relations: ['department', 'user', 'reportPeriod'],
            order: { updateDate: 'DESC' },
        });

        return reports.map(report => ({
            id: report.id,
            state: report.state,
            stateLabel: ReportStateLabel[report.state],
            departmentName: report.department?.name,
            startDate: report.reportPeriod?.startDate,
            endDate: report.reportPeriod?.endDate,
            period: report.reportPeriod?.period,
            periodLabel: PeriodLabel[report.reportPeriod?.period],
            reportPeriodName: report.reportPeriod?.name,
            reportPeriodNameLabel: ReportNameLabel[report.reportPeriod?.name],
            updateDate: report.updateDate,
            userName: report.user?.fullName || null,
        }));
    }
}


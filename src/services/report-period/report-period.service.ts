import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReportPeriodDto } from '@shared/dtos/report/create-report-period.dto';
import { UpdateReportPeriodDto } from '@shared/dtos/report/update-report-period.dto';
import { Department } from 'src/entities/department.entity';
import { ReportPeriod } from 'src/entities/report-period.entity';
import { Report } from 'src/entities/report.entity';
import { ReportState, ReportStateLabel } from 'src/enums/report-state.enum';
import { DataSource, Equal, In, LessThan, LessThanOrEqual, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { IReportPeriodService, IReportService } from './report-period.service.interface';
import { ReportResponseDto } from '@shared/dtos/report/report-response.dto';
import { PeriodLabel } from 'src/enums/period.enum';
import { ReportNameLabel } from 'src/enums/reportName.enum';
import { ReportPeriodResponseDto } from '@shared/dtos/report/report-period-response.dto';
import { CreateReportDto } from '@shared/dtos/report/create-report.dto';
import { createEmptyInfos } from 'src/utils/report-info.factory';
import { UpdateReportInfosDto } from '@shared/dtos/report/update-reportInfo.dto';
import { User } from 'src/entities/user.entity';


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
            const existing = await queryRunner.manager.findOne(ReportPeriod, {
                where: { year: dto.year },
            });
            if (existing) {
                throw new BadRequestException(`Đã tồn tại kỳ báo cáo cho năm ${dto.year}`);
            }

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
            const reports: Report[] = [];
            for (const dept of departments) {
                const report = queryRunner.manager.create(Report, {
                    department: dept,
                    updateDate: null,
                    state: ReportState.Pending,
                    reportPeriod: savedPeriod,
                    user: null,
                });

                const emptyInfos = createEmptyInfos(queryRunner.manager);
                Object.assign(report, emptyInfos);

                reports.push(report);
            }

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

        if (dto.startDate || dto.endDate) {
            const now = new Date();
            let newState: ReportState;

            if (now < updatedPeriod.startDate) {
                newState = ReportState.Pending;
            } else if (now > updatedPeriod.endDate) {
                newState = ReportState.Expired;
            } else {
                newState = ReportState.Pending;
            }

            await this.reportRepo.update(
                { reportPeriod: { id } },
                { state: newState }
            );
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

    async checkYearExists(year: number): Promise<boolean> {
        const found = await this.repo.findOne({ where: { year } });
        return !!found;
    }

    async getActiveYears(): Promise<number[]> {
        const periods = await this.repo
            .createQueryBuilder('period')
            .select('DISTINCT period.year', 'year')
            .where('period.active = :active', { active: true })
            .orderBy('period.year', 'ASC')
            .getRawMany();

        return periods.map(p => p.year);
    }


}




@Injectable()
export class ReportService implements IReportService {
    constructor(
        @InjectRepository(ReportPeriod)
        private readonly repo: Repository<ReportPeriod>,

        @InjectRepository(Report)
        private readonly reportRepo: Repository<Report>,

        @InjectRepository(Department)
        private readonly departmentRepo: Repository<Department>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        private readonly dataSource: DataSource,

    ) { }

    async getReportsByDepartment(departmentId: string): Promise<ReportResponseDto[]> {
        const reports = await this.reportRepo.find({
            where: {
                department: { id: departmentId },
                reportPeriod: { active: true },
            },
            relations: ['department', 'user', 'reportPeriod'],
            order: { updateDate: 'DESC' },
        });

        return reports.map(report => ({
            id: report.id,
            year: report.reportPeriod.year,
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

    async getReportsByPeriodYear(departmentId: string, year: number): Promise<ReportResponseDto[]> {
        const reports = await this.reportRepo.find({
            where: {
                department: { id: departmentId },
                reportPeriod: { year: year },
            },
            relations: ['department', 'user', 'reportPeriod'],
            order: { updateDate: 'DESC' },
        });

        return reports.map(report => ({
            id: report.id,
            year: report.reportPeriod.year,
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

    async createReport(dto: CreateReportDto): Promise<Report> {
        // Kiểm tra department
        const department = await this.departmentRepo.findOne({ where: { id: dto.departmentId } });
        if (!department) {
            throw new NotFoundException(`Không tìm thấy phòng ban với id: ${dto.departmentId}`);
        }

        // Kiểm tra reportPeriod
        const reportPeriod = await this.repo.findOne({ where: { id: dto.reportPeriodId } });
        if (!reportPeriod) {
            throw new NotFoundException(`Không tìm thấy kỳ báo cáo với id: ${dto.reportPeriodId}`);
        }

        // Kiểm tra báo cáo trùng
        const existingReport = await this.reportRepo.findOne({
            where: {
                department: { id: dto.departmentId },
                reportPeriod: { id: dto.reportPeriodId },
            },
            relations: ['department', 'reportPeriod'],
        });
        if (existingReport) {
            throw new BadRequestException('Báo cáo đã tồn tại cho phòng ban và kỳ báo cáo này');
        }

        // Tạo báo cáo mới
        const report = this.reportRepo.create({

            department: department,
            updateDate: null,
            state: ReportState.Expired,
            user: null,
            reportPeriod: reportPeriod,

        });

        const emptyInfos = createEmptyInfos(this.dataSource.manager);
        Object.assign(report, emptyInfos);

        return this.reportRepo.save(report);
    }

    async markReportsAsExpired(): Promise<void> {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // reset về 00:00

        // Tìm tất cả kỳ báo cáo đã kết thúc
        const expiredPeriods = await this.repo.find({
            where: {
                endDate: LessThan(today),
            },
        });

        if (expiredPeriods.length === 0) return;

        for (const period of expiredPeriods) {
            const targetReports = await this.reportRepo.find({
                where: {
                    reportPeriod: { id: period.id },
                    state: In([ReportState.Pending, ReportState.Typing]),
                },
            });

            if (targetReports.length === 0) continue;

            for (const report of targetReports) {
                report.state = ReportState.Expired;
            }

            await this.reportRepo.save(targetReports);
        }
    }

    async updateReportInfos(
        reportId: string,
        dto: UpdateReportInfosDto,
        userId: string,
        markComplete: boolean = false,
    ): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const report = await queryRunner.manager.findOne(Report, {
                where: { id: reportId },
                relations: [
                    'accidentInfos',
                    'environmentalMonitorings',
                    'equipmentInspections',
                    'healthClassifications',
                    'laborInfos',
                    'occupationalDiseases',
                    'riskAssessmentSchedules',
                    'safetyPlanImplementations',
                    'serviceProviders',
                    'toxicAllowances',
                    'trainingSafetyHygienes',
                    'workingTimes',
                ],
            });

            if (!report) throw new NotFoundException('Không tìm thấy báo cáo');

            if ([ReportState.Completed, ReportState.Expired].includes(report.state)) {
                throw new BadRequestException('Không thể cập nhật báo cáo đã hoàn thành hoặc đã hết hạn');
            }

            const now = new Date();
            if (report.reportPeriod.startDate && report.reportPeriod.endDate) {
                if (now < report.reportPeriod.startDate || now > report.reportPeriod.endDate) {
                    throw new BadRequestException('Chỉ được cập nhật trong thời gian báo cáo cho phép');
                }
            }

            const user = await queryRunner.manager.findOne(User, { where: { id: userId } });
            if (!user) throw new NotFoundException('Không tìm thấy người dùng');

            const updatePartial = <T>(entity: T, values: Partial<T>) => {
                if (!entity || !values) return;
                Object.entries(values).forEach(([key, value]) => {
                    if (value !== undefined) {
                        entity[key] = value;
                    }
                });
            };

            await updatePartial(report.accidentInfos, dto.accidentInfo);
            await updatePartial(report.environmentalMonitorings, dto.environmentalMonitoring);
            await updatePartial(report.equipmentInspections, dto.equipmentInspection);
            await updatePartial(report.healthClassifications, dto.healthClassification);
            await updatePartial(report.laborInfos, dto.laborInfo);
            await updatePartial(report.occupationalDiseases, dto.occupationalDisease);
            await updatePartial(report.riskAssessmentSchedules, dto.riskAssessmentSchedule);
            await updatePartial(report.safetyPlanImplementations, dto.safetyPlanImplementation);
            await updatePartial(report.serviceProviders, dto.serviceProvider);
            await updatePartial(report.toxicAllowances, dto.toxicAllowance);
            await updatePartial(report.trainingSafetyHygienes, dto.trainingSafetyHygiene);
            await updatePartial(report.workingTimes, dto.workingTime);

            report.user = user;
            report.updateDate = new Date();

            if (markComplete) {
                report.state = ReportState.Completed;
            }

            await queryRunner.manager.save([
                report.accidentInfos,
                report.environmentalMonitorings,
                report.equipmentInspections,
                report.healthClassifications,
                report.laborInfos,
                report.occupationalDiseases,
                report.riskAssessmentSchedules,
                report.safetyPlanImplementations,
                report.serviceProviders,
                report.toxicAllowances,
                report.trainingSafetyHygienes,
                report.workingTimes,
            ]);

            await queryRunner.manager.save(report);

            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async startTyping(reportId: string, userId: string): Promise<void> {
        const [report, user] = await Promise.all([
            this.reportRepo.findOne({
                where: { id: reportId },
                relations: ['department'],
            }),
            this.userRepo.findOne({ where: { id: userId } }),
        ]);

        if (!report) throw new NotFoundException('Không tìm thấy báo cáo');
        if (!user) throw new NotFoundException('Không tìm thấy người dùng');

        if (report.state !== ReportState.Pending) return;

        report.state = ReportState.Typing;
        report.updateDate = new Date();
        report.user = user;

        await this.reportRepo.save(report);
    }

    async findByIdWithRelations(reportId: string): Promise<Report> {
        const report = await this.reportRepo.findOne({
            where: { id: reportId },
            relations: [
                'department',
                'reportPeriod',
                'user',
                'accidentInfos',
                'laborInfos',
                'occupationalDiseases',
                'healthClassifications',
                'trainingSafetyHygienes',
                'equipmentInspections',
                'workingTimes',
                'toxicAllowances',
                'environmentalMonitorings',
                'safetyPlanImplementations',
                'serviceProviders',
                'riskAssessmentSchedules',
            ],
        });

        if (!report) {
            throw new NotFoundException('Không tìm thấy báo cáo');
        }

        return report;
    }

}


import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReportPeriodDto } from '@shared/dtos/report/create-report-period.dto';
import { UpdateReportPeriodDto } from '@shared/dtos/report/update-report-period.dto';
import { ReportPeriod } from 'src/entities/report-period.entity';
import { Repository } from 'typeorm';


@Injectable()
export class ReportPeriodService {
    constructor(
        @InjectRepository(ReportPeriod)
        private readonly repo: Repository<ReportPeriod>,
    ) { }

    async create(dto: CreateReportPeriodDto) {
        const period = this.repo.create(dto);
        return this.repo.save(period);
    }

    async findAll() {
        return this.repo.find();
    }

    async findOne(id: string) {
        const period = await this.repo.findOne({ where: { id } });
        if (!period) throw new NotFoundException('Report period not found');
        return period;
    }

    async update(id: string, dto: UpdateReportPeriodDto) {
        const period = await this.findOne(id);
        Object.assign(period, dto);
        return this.repo.save(period);
    }

}

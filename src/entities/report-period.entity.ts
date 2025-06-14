import { Period } from 'src/enums/period.enum';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Report } from './report.entity';
import { ReportName } from 'src/enums/reportName.enum';

@Entity('report_periods')
export class ReportPeriod {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int', nullable: true })
    year: number;

    @Column({
        type: 'enum',
        enum: ReportName,
        default: ReportName.Name,
    })
    name: ReportName;

    @Column({
        type: 'enum',
        enum: Period,
        default: Period.OneYear,
    })
    period: Period;

    @Column({ type: 'date' })
    startDate: Date;

    @Column({ type: 'date' })
    endDate: Date;

    @Column({ default: true })
    active: boolean;

    @OneToMany(() => Report, (report) => report.reportPeriod, {
        cascade: ['remove'],
    })
    reports: Report[];
}
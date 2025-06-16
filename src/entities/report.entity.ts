import { Period } from 'src/enums/period.enum';
import { ReportState } from 'src/enums/report-state.enum';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Department } from './department.entity';
import { ReportPeriod } from './report-period.entity';

@Entity('reports')
export class Report {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: ReportState,
        default: ReportState.Pending,
    })
    state: ReportState;

    @ManyToOne(() => Department, department => department.reports)
    @JoinColumn({ name: 'department_id' })
    department: Department;

    @Column({ type: 'date', nullable: true })
    updateDate: Date;

    @ManyToOne(() => User, { nullable: true, eager: true })
    @JoinColumn({ name: 'user_id' })
    user: User;


    @ManyToOne(() => ReportPeriod, reportPeriod => reportPeriod.reports, { onDelete: 'CASCADE', })
    @JoinColumn({ name: 'report_period_id' })
    reportPeriod: ReportPeriod;

}
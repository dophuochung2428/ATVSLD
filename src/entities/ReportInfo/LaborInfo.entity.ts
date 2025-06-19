import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Report } from "../report.entity";

@Entity('report_labor_infos')
export class ReportLaborInfo {

    @PrimaryGeneratedColumn('uuid')
    id: string;
    // Tổng số lao động
    @Column({ type: 'int', nullable: true })
    totalWorkers: number;
    // Lao động nữ
    @Column({ type: 'int', nullable: true })
    femaleWorkers: number;
    // Lao động dưới 15 tuổi
    @Column({ type: 'int', nullable: true })
    under15: number;

    // Người làm công tác ATVSLD
    @Column({ type: 'int', nullable: true })
    implementerATVSLD: number;
    // Lao động trong điều kiện độc hại
    @Column({ type: 'int', nullable: true })
    workersInDangerousJob: number;
    // Lao động là người khuyết tật
    @Column({ type: 'int', nullable: true })
    workersWithDisability: number;

    // Người làm công tác y tế
    @Column({ type: 'int', nullable: true })
    healthWorker: number;
    // Lao động là người chưa thành niên
    @Column({ type: 'int', nullable: true })
    minorWorker: number
    // Lao động là người cao tuổi
    @Column({ type: 'int', nullable: true })
    elderlyWorkers: number;


    @OneToOne(() => Report, r => r.laborInfos, { onDelete: 'CASCADE' })
    @JoinColumn()
    report: Report;
}

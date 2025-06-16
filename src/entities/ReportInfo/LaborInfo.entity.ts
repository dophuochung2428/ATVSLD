import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Report } from "../report.entity";

@Entity('report_labor_infos')
export class ReportLaborInfo {

    @PrimaryGeneratedColumn('uuid')
    id: string;
    // Tổng số lao động
    @Column()
    totalWorkers: number;
    // Lao động nữ
    @Column()
    femaleWorkers: number;
    // Lao động dưới 15 tuổi
    @Column()
    under15: number;

    // Người làm công tác ATVSLD
    @Column()
    implementerATVSLD: number;
    // Lao động trong điều kiện độc hại
    @Column()
    workersInDangerousJob: number;
    // Lao động là người khuyết tật
    @Column()
    workersWithDisability: number;

    // Người làm công tác y tế
    @Column()
    healthWorker: number;
    // Lao động là người chưa thành niên
    @Column()
    minorWorker: number
    // Lao động là người cao tuổi
    @Column()
    elderlyWorkers: number;


    @OneToOne(() => Report, r => r.laborInfos, { onDelete: 'CASCADE' })
    @JoinColumn()
    report: Report;
}

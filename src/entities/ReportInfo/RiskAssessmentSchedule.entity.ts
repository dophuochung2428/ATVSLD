import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Report } from "../report.entity";

@Entity()
export class RiskAssessmentSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  monthYear: string; // Tháng/Năm

  @OneToOne(() => Report, (report) => report.riskAssessmentSchedules, { onDelete: 'CASCADE' })
  @JoinColumn()
  report: Report;
}

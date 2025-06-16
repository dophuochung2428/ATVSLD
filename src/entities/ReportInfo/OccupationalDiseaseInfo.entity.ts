import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Report } from "../report.entity";

@Entity()
export class OccupationalDisease {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', default: 0 })
  totalBNNLastPeriod: number; // Tổng số người bị BNN tại thời điểm BC

  @Column({ type: 'int', default: 0 })
  newBNNCases: number; // Số người mắc mới BNN

  @Column({ type: 'int', default: 0 })
  workDaysLostDueToBNN: number; // Số ngày công nghỉ do BNN

  @Column({ type: 'int', default: 0 })
  bnnBeforeRetirementAge: number; // Số người phải nghỉ trước tuổi hưu vì BNN

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalBNNCost: number; // Tổng chi phí BNN phát sinh trong năm (triệu đồng)

  @OneToOne(() => Report, (report) => report.occupationalDiseases, { onDelete: 'CASCADE' })
  @JoinColumn()
  report: Report;
}

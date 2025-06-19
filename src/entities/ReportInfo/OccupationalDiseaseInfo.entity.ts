import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Report } from "../report.entity";

@Entity()
export class OccupationalDisease {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: true })
  totalBNNLastPeriod: number; // Tổng số người bị BNN tại thời điểm BC

  @Column({ type: 'int', nullable: true })
  newBNNCases: number; // Số người mắc mới BNN

  @Column({ type: 'int', nullable: true })
  workDaysLostDueToBNN: number; // Số ngày công nghỉ do BNN

  @Column({ type: 'int', nullable: true })
  bnnBeforeRetirementAge: number; // Số người phải nghỉ trước tuổi hưu vì BNN

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalBNNCost: number; // Tổng chi phí BNN phát sinh trong năm (triệu đồng)

  @OneToOne(() => Report, (report) => report.occupationalDiseases, { onDelete: 'CASCADE' })
  @JoinColumn()
  report: Report;
}

import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Report } from "../report.entity";

@Entity()
export class ToxicAllowance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', default: 0 })
  totalWorkersReceived: number; // Tổng số người

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalCost: number; // Tổng chi phí theo quy định tại điểm 10 (triệu đồng)

  @OneToOne(() => Report, (report) => report.toxicAllowances, { onDelete: 'CASCADE' })
  @JoinColumn()
  report: Report;
}

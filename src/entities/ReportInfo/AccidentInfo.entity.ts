import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Report } from "../report.entity";

@Entity()
export class AccidentInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Tổng số vụ tai nạn lao động
  @Column()
  totalAccidents: number;
// Số người chết vì TNLD
  @Column()
  deaths: number;
// Số vụ có người chết
  @Column()
  numberOfFatalIncidents: number;
// Tổng chi phí cho TNLD
  @Column()
  totalCost: number;
// Số người bị TNLD
  @Column()
  totalInjured: number;
// Số ngày công vì TNLD
  @Column()
  lostWorkDays: number;

  @OneToOne(() => Report, (report) => report.accidentInfos, { onDelete: 'CASCADE' })
  @JoinColumn()
  report: Report;
}

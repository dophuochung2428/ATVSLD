import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Report } from "../report.entity";

@Entity()
export class AccidentInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Tổng số vụ tai nạn lao động
  @Column({nullable: true})
  totalAccidents: number;
// Số người chết vì TNLD
  @Column({nullable: true})
  deaths: number;
// Số vụ có người chết
  @Column({nullable: true})
  numberOfFatalIncidents: number;
// Tổng chi phí cho TNLD
  @Column({nullable: true})
  totalCost: number;
// Số người bị TNLD
  @Column({nullable: true})
  totalInjured: number;
// Số ngày công vì TNLD
  @Column({nullable: true})
  lostWorkDays: number;

  @OneToOne(() => Report, (report) => report.accidentInfos, { onDelete: 'CASCADE' })
  @JoinColumn()
  report: Report;
}

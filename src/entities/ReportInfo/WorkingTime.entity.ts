import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Report } from "../report.entity";

@Entity()
export class WorkingTime {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: true })
  totalPeopleOvertimeInYear: number; // Tổng số người làm thêm trong năm (người)

  @Column({ type: 'int', nullable: true })
  totalOvertimeInYear: number; // Tổng số giờ làm thêm trong năm (người)

  @Column({ type: 'int', nullable: true })
  overtimeHighestOfMonth: number; // Số giờ làm thêm vượt 1 tháng (người)

  @OneToOne(() => Report, (report) => report.workingTimes, { onDelete: 'CASCADE' })
  @JoinColumn()
  report: Report;
}

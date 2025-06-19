import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Report } from "../report.entity";

@Entity()
export class EquipmentInspection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: true })
  totalEquipment: number; // Tổng số

  @Column({ type: 'int', nullable: true })
  inspected: number; // Số đã được kiểm định

  @Column({ type: 'int', nullable: true })
  notInspected: number; // Số chưa được kiểm định

  @Column({ type: 'int', nullable: true })
  used: number; // Số đang sử dụng

  @Column({ type: 'int', nullable: true })
  declared: number; // Số đã được khai báo

  @Column({ type: 'int', nullable: true })
  notDeclared: number; // Số chưa được khai báo

  @OneToOne(() => Report, (report) => report.equipmentInspections, { onDelete: 'CASCADE' })
  @JoinColumn()
  report: Report;
}

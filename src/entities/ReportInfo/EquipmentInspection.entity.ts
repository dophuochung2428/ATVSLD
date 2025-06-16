import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Report } from "../report.entity";

@Entity()
export class EquipmentInspection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', default: 0 })
  totalEquipment: number; // Tổng số

  @Column({ type: 'int', default: 0 })
  inspected: number; // Số đã được kiểm định

  @Column({ type: 'int', default: 0 })
  notInspected: number; // Số chưa được kiểm định

  @Column({ type: 'int', default: 0 })
  used: number; // Số đang sử dụng

  @Column({ type: 'int', default: 0 })
  declared: number; // Số đã được khai báo

  @Column({ type: 'int', default: 0 })
  notDeclared: number; // Số chưa được khai báo

  @OneToOne(() => Report, (report) => report.equipmentInspections, { onDelete: 'CASCADE' })
  @JoinColumn()
  report: Report;
}

import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Report } from "../report.entity";

@Entity()
export class ServiceProvider {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'text', nullable: true })
  serviceATVSLDName: string; // Tên tổ chức dịch vụ ATVSLĐ được thuê

  @Column({ type: 'text', nullable: true })
  serviceMedicalName: string; // Tên tổ chức dịch vụ y tế được thuê

  @OneToOne(() => Report, (report) => report.serviceProviders, { onDelete: 'CASCADE' })
  @JoinColumn()
  report: Report;
}

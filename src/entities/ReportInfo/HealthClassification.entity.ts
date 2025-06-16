import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Report } from "../report.entity";

@Entity()
export class HealthClassification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', default: 0 })
  typeI: number; // Loại I (Người)

  @Column({ type: 'int', default: 0 })
  typeII: number; // Loại II (Người)

  @Column({ type: 'int', default: 0 })
  typeIII: number; // Loại III (Người)

  @Column({ type: 'int', default: 0 })
  typeIV: number; // Loại IV (Người)

  @Column({ type: 'int', default: 0 })
  typeV: number; // Loại V (Người)

  @OneToOne(() => Report, (report) => report.healthClassifications, { onDelete: 'CASCADE' })
  @JoinColumn()
  report: Report;
}

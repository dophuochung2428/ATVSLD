import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Report } from "../report.entity";

@Entity()
export class HealthClassification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: true })
  typeI: number; // Loại I (Người)

  @Column({ type: 'int', nullable: true })
  typeII: number; // Loại II (Người)

  @Column({ type: 'int', nullable: true })
  typeIII: number; // Loại III (Người)

  @Column({ type: 'int', nullable: true })
  typeIV: number; // Loại IV (Người)

  @Column({ type: 'int', nullable: true })
  typeV: number; // Loại V (Người)

  @OneToOne(() => Report, (report) => report.healthClassifications, { onDelete: 'CASCADE' })
  @JoinColumn()
  report: Report;
}

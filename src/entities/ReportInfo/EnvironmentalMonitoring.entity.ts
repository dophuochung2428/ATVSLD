import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Report } from "../report.entity";

@Entity()
export class EnvironmentalMonitoring {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int', default: 0 })
    totalSamples: number; // Số mẫu quan trắc môi trường (mẫu)

    @Column({ type: 'int', default: 0 })
    samplesNotStandard: number; // Số mẫu không đạt tiêu chuẩn

    @Column({ type: 'varchar', nullable: true })
    temperature: string; // Mẫu nhiệt độ không đạt (Mẫu/Mẫu)

    @Column({ type: 'varchar', nullable: true })
    humidity: string; // Mẫu độ ẩm không đạt (Mẫu/Mẫu)

    @Column({ type: 'varchar', nullable: true })
    airSpeed: string; // Mẫu tốc độ gió không đạt (Mẫu/Mẫu)

    @Column({ type: 'varchar', nullable: true })
    light: string; // Mẫu tiếng ánh sáng không đạt (Mẫu/Mẫu)

    @Column({ type: 'varchar', nullable: true })
    noise: string; // Mẫu tiếng ồn không đạt (Mẫu/Mẫu)

    @Column({ type: 'varchar', nullable: true })
    dust: string; // Mẫu bụi không đạt (Mẫu/Mẫu)

    @Column({ type: 'varchar', nullable: true })
    vibrate: string; // Mẫu rung không đạt (Mẫu/Mẫu)

    @Column({ type: 'varchar', nullable: true })
    toxicGas: string; // Mẫu khí độc không đạt (Mẫu/Mẫu)

    @Column({ type: 'varchar', nullable: true })
    radioactive: string; // Mẫu phóng xạ không đạt (Mẫu/Mẫu)

    @Column({ type: 'varchar', nullable: true })
    electromagneticField: string; // Mẫu điện từ trường không đạt (Mẫu/Mẫu)

    @Column({ type: 'varchar', nullable: true })
    other: string; // Mẫu khác không đạt (Mẫu/Mẫu)

    @OneToOne(() => Report, (report) => report.environmentalMonitorings, { onDelete: 'CASCADE' })
    @JoinColumn()
    report: Report;
}

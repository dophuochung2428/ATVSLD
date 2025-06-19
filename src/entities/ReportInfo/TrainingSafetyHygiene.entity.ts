import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Report } from "../report.entity";

@Entity()
export class TrainingSafetyHygiene {
    @PrimaryGeneratedColumn('uuid')
    id: string;


    @Column({ type: 'varchar', nullable: true })
    group1: string;

    @Column({ type: 'varchar', nullable: true })
    group2: string;

    @Column({ type: 'varchar', nullable: true })
    group3: string;

    @Column({ type: 'varchar', nullable: true })
    group4: string;

    @Column({ type: 'varchar', nullable: true })
    group5: string;

    @Column({ type: 'varchar', nullable: true })
    group6: string;

    @Column({ type: 'varchar', nullable: true })
    selfTraining: string;

    @Column({ type: 'varchar', nullable: true })
    hireTrainer: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    totalTrainingCost: number; // Tổng chi phí huấn luyện (triệu đồng)

    @OneToOne(() => Report, (report) => report.trainingSafetyHygienes, { onDelete: 'CASCADE' })
    @JoinColumn()
    report: Report;
}

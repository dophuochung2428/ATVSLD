import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Report } from "../report.entity";

@Entity()
export class SafetyPlanImplementation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    safeTechCost: number; // Chi phí kĩ thuật an toàn

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    hygieneCost: number; // Các biện pháp kỹ thuật vệ sinh

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    personalProtectionCost: number; // Trang bị phương tiện bảo vệ cá nhân

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    healthMonitoringCost: number; // Các chi phí cssk người lao động

    @Column({ type: 'int',nullable: true })
    trainedPeople: number; // Số người được huấn luyện

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    riskAssessmentCost: number; // Đánh giá nguy cơ rủi ro về ATVSLĐ

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    otherCost: number; // Chi phí khác

    @OneToOne(() => Report, (report) => report.safetyPlanImplementations, { onDelete: 'CASCADE' })
    @JoinColumn()
    report: Report;
}

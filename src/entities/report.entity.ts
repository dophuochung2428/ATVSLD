import { Period } from 'src/enums/period.enum';
import { ReportState } from 'src/enums/report-state.enum';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { Department } from './department.entity';
import { ReportPeriod } from './report-period.entity';
import { AccidentInfo } from './ReportInfo/AccidentInfo.entity';
import { ReportLaborInfo } from './ReportInfo/LaborInfo.entity';
import { OccupationalDisease } from './ReportInfo/OccupationalDiseaseInfo.entity';
import { HealthClassification } from './ReportInfo/HealthClassification.entity';
import { TrainingSafetyHygiene } from './ReportInfo/TrainingSafetyHygiene.entity';
import { EquipmentInspection } from './ReportInfo/EquipmentInspection.entity';
import { WorkingTime } from './ReportInfo/WorkingTime.entity';
import { ToxicAllowance } from './ReportInfo/ToxicAllowance.entity';
import { EnvironmentalMonitoring } from './ReportInfo/EnvironmentalMonitoring.entity';
import { SafetyPlanImplementation } from './ReportInfo/SafetyPlanImplementation.entity';
import { ServiceProvider } from './ReportInfo/ServiceProvider.entity';
import { RiskAssessmentSchedule } from './ReportInfo/RiskAssessmentSchedule.entity';

@Entity('reports')
export class Report {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: ReportState,
        default: ReportState.Pending,
    })
    state: ReportState;

    @ManyToOne(() => Department, department => department.reports,
        {
            onDelete: 'CASCADE'
        })
    @JoinColumn({ name: 'department_id' })
    department: Department;

    @Column({ type: 'date', nullable: true })
    updateDate: Date;

    @ManyToOne(() => User, { nullable: true, eager: true, onDelete: 'SET NULL', })
    @JoinColumn({ name: 'user_id' })
    user: User;


    @ManyToOne(() => ReportPeriod, reportPeriod => reportPeriod.reports, { onDelete: 'CASCADE', })
    @JoinColumn({ name: 'report_period_id' })
    reportPeriod: ReportPeriod;


    /////////////////////////////////////////////////////////////////////
    @OneToOne(() => AccidentInfo, (accidentInfos) => accidentInfos.report, { cascade: true, })
    accidentInfos: AccidentInfo;

    @OneToOne(() => ReportLaborInfo, (laborInfos) => laborInfos.report, { cascade: true, })
    laborInfos: ReportLaborInfo;

    @OneToOne(() => OccupationalDisease, (occ) => occ.report, { cascade: true, })
    occupationalDiseases: OccupationalDisease;

    @OneToOne(() => HealthClassification, (healthCare) => healthCare.report, { cascade: true, })
    healthClassifications: HealthClassification;

    @OneToOne(() => TrainingSafetyHygiene, (trainSafe) => trainSafe.report, { cascade: true, })
    trainingSafetyHygienes: TrainingSafetyHygiene;

    @OneToOne(() => EquipmentInspection, (equipment) => equipment.report, { cascade: true, })
    equipmentInspections: EquipmentInspection;

    @OneToOne(() => WorkingTime, (workingTimes) => workingTimes.report, { cascade: true, })
    workingTimes: WorkingTime;

    @OneToOne(() => ToxicAllowance, (toxicAllowances) => toxicAllowances.report, { cascade: true, })
    toxicAllowances: ToxicAllowance;

    @OneToOne(() => EnvironmentalMonitoring, (environmentalMonitorings) => environmentalMonitorings.report, { cascade: true, })
    environmentalMonitorings: EnvironmentalMonitoring;

    @OneToOne(() => SafetyPlanImplementation, (safetyPlan) => safetyPlan.report, { cascade: true, })
    safetyPlanImplementations: SafetyPlanImplementation;

    @OneToOne(() => ServiceProvider, (serviceProviders) => serviceProviders.report, { cascade: true, })
    serviceProviders: ServiceProvider;

    @OneToOne(() => RiskAssessmentSchedule, (risk) => risk.report, { cascade: true, })
    riskAssessmentSchedules: RiskAssessmentSchedule;

}
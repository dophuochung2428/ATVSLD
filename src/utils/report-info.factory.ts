import { EntityManager } from 'typeorm';
import { AccidentInfo } from 'src/entities/ReportInfo/AccidentInfo.entity';
import { ReportLaborInfo } from 'src/entities/ReportInfo/LaborInfo.entity';
import { OccupationalDisease } from 'src/entities/ReportInfo/OccupationalDiseaseInfo.entity';
import { HealthClassification } from 'src/entities/ReportInfo/HealthClassification.entity';
import { TrainingSafetyHygiene } from 'src/entities/ReportInfo/TrainingSafetyHygiene.entity';
import { EquipmentInspection } from 'src/entities/ReportInfo/EquipmentInspection.entity';
import { WorkingTime } from 'src/entities/ReportInfo/WorkingTime.entity';
import { ToxicAllowance } from 'src/entities/ReportInfo/ToxicAllowance.entity';
import { EnvironmentalMonitoring } from 'src/entities/ReportInfo/EnvironmentalMonitoring.entity';
import { SafetyPlanImplementation } from 'src/entities/ReportInfo/SafetyPlanImplementation.entity';
import { ServiceProvider } from 'src/entities/ReportInfo/ServiceProvider.entity';
import { RiskAssessmentSchedule } from 'src/entities/ReportInfo/RiskAssessmentSchedule.entity';

export function createEmptyInfos(manager: EntityManager) {
    return {
        accidentInfos: manager.create(AccidentInfo, {}),
        laborInfos: manager.create(ReportLaborInfo, {}),
        occupationalDiseases: manager.create(OccupationalDisease, {}),
        healthClassifications: manager.create(HealthClassification, {}),
        trainingSafetyHygienes: manager.create(TrainingSafetyHygiene, {}),
        equipmentInspections: manager.create(EquipmentInspection, {}),
        workingTimes: manager.create(WorkingTime, {}),
        toxicAllowances: manager.create(ToxicAllowance, {}),
        environmentalMonitorings: manager.create(EnvironmentalMonitoring, {}),
        safetyPlanImplementations: manager.create(SafetyPlanImplementation, {}),
        serviceProviders: manager.create(ServiceProvider, {}),
        riskAssessmentSchedules: manager.create(RiskAssessmentSchedule, {}),
    };
}

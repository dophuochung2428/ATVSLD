// src/dtos/report-info.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AccidentInfoDto {
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() totalAccidents?: number;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() deaths?: number;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() numberOfFatalIncidents?: number;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() totalCost?: number;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() totalInjured?: number;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() lostWorkDays?: number;
}

export class EnvironmentalMonitoringDto {
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() totalSamples?: number;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() samplesNotStandard?: number;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsString() temperature?: string;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsString() humidity?: string;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsString() airSpeed?: string;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsString() light?: string;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsString() noise?: string;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsString() dust?: string;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsString() vibrate?: string;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsString() toxicGas?: string;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsString() radioactive?: string;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsString() electromagneticField?: string;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsString() other?: string;
}

export class EquipmentInspectionDto {
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() totalEquipment?: number;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() inspected?: number;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() notInspected?: number;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() used?: number;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() declared?: number;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() notDeclared?: number;
}

export class HealthClassificationDto {
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() typeI?: number;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() typeII?: number;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() typeIII?: number;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() typeIV?: number;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() typeV?: number;
}

export class ReportLaborInfoDto {
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() totalWorkers?: number;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() femaleWorkers?: number;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() under15?: number;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() implementerATVSLD?: number;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() workersInDangerousJob?: number;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() workersWithDisability?: number;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() healthWorker?: number;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() minorWorker?: number;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() elderlyWorkers?: number;
}

export class OccupationalDiseaseDto {
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() totalBNNLastPeriod?: number;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() newBNNCases?: number;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() workDaysLostDueToBNN?: number;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() bnnBeforeRetirementAge?: number;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() totalBNNCost?: number;
}

export class RiskAssessmentScheduleDto {
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsString() monthYear?: string;
}

export class SafetyPlanImplementationDto {
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() safeTechCost?: number;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() hygieneCost?: number;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() personalProtectionCost?: number;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() healthMonitoringCost?: number;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() trainedPeople?: number;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() riskAssessmentCost?: number;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() otherCost?: number;
}

export class ServiceProviderDto {
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsString() serviceATVSLDName?: string;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsString() serviceMedicalName?: string;
}

export class ToxicAllowanceDto {
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() totalWorkersReceived?: number;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() totalCost?: number;
}

export class TrainingSafetyHygieneDto {
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsString() group1?: string;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsString() group2?: string;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsString() group3?: string;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsString() group4?: string;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsString() group5?: string;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsString() group6?: string;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsString() selfTraining?: string;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsString() hireTrainer?: string;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() totalTrainingCost?: number;
}

export class WorkingTimeDto {
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() totalPeopleOvertimeInYear?: number;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() totalOvertimeInYear?: number;
  @ApiPropertyOptional({ example: undefined}) @IsOptional() @IsNumber() overtimeHighestOfMonth?: number;
}

export class UpdateReportInfosDto {
  @Type(() => AccidentInfoDto) @ApiPropertyOptional({ type: AccidentInfoDto }) accidentInfo?: AccidentInfoDto;
  @Type(() => EnvironmentalMonitoringDto) @ApiPropertyOptional({ type: EnvironmentalMonitoringDto }) environmentalMonitoring?: EnvironmentalMonitoringDto;
  @Type(() => EquipmentInspectionDto) @ApiPropertyOptional({ type: EquipmentInspectionDto }) equipmentInspection?: EquipmentInspectionDto;
  @Type(() => HealthClassificationDto) @ApiPropertyOptional({ type: HealthClassificationDto }) healthClassification?: HealthClassificationDto;
  @Type(() => ReportLaborInfoDto) @ApiPropertyOptional({ type: ReportLaborInfoDto }) laborInfo?: ReportLaborInfoDto;
  @Type(() => OccupationalDiseaseDto) @ApiPropertyOptional({ type: OccupationalDiseaseDto }) occupationalDisease?: OccupationalDiseaseDto;
  @Type(() => RiskAssessmentScheduleDto) @ApiPropertyOptional({ type: RiskAssessmentScheduleDto }) riskAssessmentSchedule?: RiskAssessmentScheduleDto;
  @Type(() => SafetyPlanImplementationDto) @ApiPropertyOptional({ type: SafetyPlanImplementationDto }) safetyPlanImplementation?: SafetyPlanImplementationDto;
  @Type(() => ServiceProviderDto) @ApiPropertyOptional({ type: ServiceProviderDto }) serviceProvider?: ServiceProviderDto;
  @Type(() => ToxicAllowanceDto) @ApiPropertyOptional({ type: ToxicAllowanceDto }) toxicAllowance?: ToxicAllowanceDto;
  @Type(() => TrainingSafetyHygieneDto) @ApiPropertyOptional({ type: TrainingSafetyHygieneDto }) trainingSafetyHygiene?: TrainingSafetyHygieneDto;
  @Type(() => WorkingTimeDto) @ApiPropertyOptional({ type: WorkingTimeDto }) workingTime?: WorkingTimeDto;
}

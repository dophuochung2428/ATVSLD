import { ExportReportData } from "./report-period.service.interface";

export const reportFieldMap: Partial<Record<keyof ExportReportData, string>> = {
    // 🟢 Thông tin doanh nghiệp
    nameOfDepartment: 'department.name',
    businessIndustryCode: 'department.business_industry_code',
    businessTypeName: 'department.business_type',
    address: 'department.address',
    phone: 'department.phone',
    yearOfPeriod: 'reportPeriod.year',
    year: 'year',
    month: 'month',
    day: 'day',

    // Lao động
    a1: 'laborInfos.totalWorkers',
    a2: 'laborInfos.femaleWorkers',
    a3: 'laborInfos.under15',
    a4: 'laborInfos.implementerATVSLD',
    a5: 'laborInfos.workersInDangerousJob',
    a6: 'laborInfos.workersWithDisability',
    a7: 'laborInfos.healthWorker',
    a8: 'laborInfos.minorWorker',
    a9: 'laborInfos.elderlyWorkers',

    // Tai nạn lao động
    b1: 'accidentInfos.totalAccidents',            // Tổng số vụ tai nạn lao động
    b2: 'accidentInfos.numberOfFatalIncidents',    // Số vụ có người chết
    b3: 'accidentInfos.totalInjured',              // Tổng số người bị tai nạn
    b4: 'accidentInfos.deaths',                    // Số người chết vì TNLD
    b5: 'accidentInfos.totalCost',                 // Tổng chi phí cho TNLD
    b6: 'accidentInfos.lostWorkDays',              // Số ngày công nghỉ vì TNLD

    // Bệnh nghề nghiệp
    c1: 'occupationalDiseases.totalBNNLastPeriod',     // Tổng số người bị BNN cộng dồn
    c2: 'occupationalDiseases.newBNNCases',            // Số người mắc mới BNN
    c3: 'occupationalDiseases.workDaysLostDueToBNN',   // Số ngày công nghỉ do BNN
    c4: 'occupationalDiseases.bnnBeforeRetirementAge', // Số người nghỉ hưu sớm vì BNN
    c5: 'occupationalDiseases.totalBNNCost',           // Tổng chi phí BNN trong năm

    // Phân loại sức khỏe
    d1: 'healthClassifications.typeI',     // Loại I
    d2: 'healthClassifications.typeII',    // Loại II
    d3: 'healthClassifications.typeIII',   // Loại III
    d4: 'healthClassifications.typeIV',    // Loại IV
    d5: 'healthClassifications.typeV',     // Loại V

    // Huấn luyện ATVSLĐ
    e1: 'trainingSafetyHygienes.group1',
    e2: 'trainingSafetyHygienes.group2',
    e3: 'trainingSafetyHygienes.group3',
    e4: 'trainingSafetyHygienes.selfTraining',
    e5: 'trainingSafetyHygienes.hireTrainer',
    e6: 'trainingSafetyHygienes.group4',
    e7: 'trainingSafetyHygienes.group5',
    e8: 'trainingSafetyHygienes.group6',
    e9: 'trainingSafetyHygienes.totalTrainingCost',

    // Máy móc thiết bị nghiêm ngặt AT-VSLĐ
    f1: 'equipmentInspections.totalEquipment',
    f2: 'equipmentInspections.used',
    f3: 'equipmentInspections.inspected',
    f4: 'equipmentInspections.notInspected',
    f5: 'equipmentInspections.declared',
    f6: 'equipmentInspections.notDeclared',

    // Thời gian làm việc, nghỉ ngơi
    g1: 'workingTimes.totalPeopleOvertimeInYear',
    g2: 'workingTimes.totalOvertimeInYear',
    g3: 'workingTimes.overtimeHighestOfMonth',

    // Bồi dưỡng chống độc hại
    h1: 'toxicAllowances.totalWorkersReceived',
    h2: 'toxicAllowances.totalCost',

    // Quan trắc môi trường
    i1: 'environmentalMonitorings.totalSamples',
    i2: 'environmentalMonitorings.samplesNotStandard',
    i3: 'environmentalMonitorings.temperature',
    i4: 'environmentalMonitorings.humidity',
    i5: 'environmentalMonitorings.airSpeed',
    i6: 'environmentalMonitorings.light',
    i7: 'environmentalMonitorings.noise',
    i8: 'environmentalMonitorings.dust',
    i9: 'environmentalMonitorings.vibrate',
    i10: 'environmentalMonitorings.toxicGas',
    i11: 'environmentalMonitorings.radioactive',
    i12: 'environmentalMonitorings.electromagneticField',
    i13: 'environmentalMonitorings.other',

    // Chi phí thực hiện kế hoạch ATVSLĐ
    k1: 'safetyPlanImplementations.safeTechCost',
    k2: 'safetyPlanImplementations.hygieneCost',
    k3: 'safetyPlanImplementations.personalProtectionCost',
    k4: 'safetyPlanImplementations.healthMonitoringCost',
    k5: 'safetyPlanImplementations.trainedPeople',
    k6: 'safetyPlanImplementations.riskAssessmentCost',
    k7: 'safetyPlanImplementations.otherCost',

    // Dịch vụ thuê ngoài
    l1: 'serviceProviders.serviceATVSLDName',
    l2: 'serviceProviders.serviceMedicalName',

    // Thời điểm đánh giá định kỳ nguy cơ rủi ro
    m1: 'riskAssessmentSchedules.monthYear',
};

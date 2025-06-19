import { ExportReportData } from "./report-period.service.interface";

export const reportFieldMap: Partial<Record<keyof ExportReportData, string>> = {
    // 🟢 Thông tin doanh nghiệp
    nameOfDepartment: 'department.name',
    businessIndustryCode: 'department.business_industry_code',
    businessTypeName: 'department.business_type',
    address: 'department.address',
    phone: 'department.phone',
    yearOfPeriod: 'reportPeriod.year',

    a1: 'laborInfos.totalWorkers',
    a2: 'laborInfos.femaleWorkers',
    a3: 'laborInfos.under15',
    a4: 'laborInfos.implementerATVSLD',
    a5: 'laborInfos.workersInDangerousJob',
    a6: 'laborInfos.workersWithDisability',
    a7: 'laborInfos.healthWorker',
    a8: 'laborInfos.minorWorker',
    a9: 'laborInfos.elderlyWorkers',
};

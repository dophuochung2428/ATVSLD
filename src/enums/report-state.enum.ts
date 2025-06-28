export enum ReportState {
  Pending = 'PENDING',
  Typing = 'TYPING',
  Completed = 'COMPLETED',
  Expired = 'EXPIRED',
  WaitingForApproval = 'WAITING_FOR_APPROVAL',
  Approved = 'APPROVED',
}

export const ReportStateLabel = {
  [ReportState.Pending]: 'Chờ báo cáo',
  [ReportState.Typing]: 'Nhập liệu',
  [ReportState.Completed]: 'Hoàn thành',
  [ReportState.Expired]: 'Hết hạn',
  [ReportState.WaitingForApproval]: 'Chờ duyệt',
  [ReportState.Approved]: 'Đã duyệt',
};
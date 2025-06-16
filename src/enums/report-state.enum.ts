export enum ReportState {
  Pending = 'PENDING',
  Typing = 'TYPING',
  Completed = 'COMPLETED',
  Expired = 'EXPIRED'
}

export const ReportStateLabel = {
  [ReportState.Pending]: 'Chờ báo cáo',
  [ReportState.Typing]: 'Nhập liệu',
  [ReportState.Completed]: 'Hoàn thành',
  [ReportState.Expired]: 'Hết hạn'
};
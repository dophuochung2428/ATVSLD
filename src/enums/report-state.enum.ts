export enum ReportState {
  Pending = 'PENDING',
  Typing = 'TYPING',
  Completed = 'COMPLETED'
}

export const ReportStateLabel = {
  [ReportState.Pending]: 'Chờ báo cáo',
  [ReportState.Typing]: 'Nhập liệu',
  [ReportState.Completed]: 'Hoàn thành'
};
export enum UserType {
  ADMIN = 'ADMIN',
  BUSINESS = 'BUSINESS',
}

export const UserTypeLabel = {
  [UserType.ADMIN]: 'Quản trị viên',
  [UserType.BUSINESS]: 'Doanh nghiệp',
};

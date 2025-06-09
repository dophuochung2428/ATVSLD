import { Gender } from '../enums/gender.enum';
import { UserType } from '../enums/userType.enum';

export function parseGenderLabel(label: string): Gender | null {
  switch (label.trim()) {
    case 'Nam':
      return Gender.MALE;
    case 'Nữ':
      return Gender.FEMALE;
    case 'Giới tính khác':
      return Gender.OTHER;
    default:
      return null;
  }
}

export function parseUserTypeLabel(label: string): UserType | null {
  switch (label.trim()) {
    case 'Quản trị viên':
      return UserType.ADMIN;
    case 'Doanh nghiệp':
      return UserType.BUSINESS;
    default:
      return null;
  }
}

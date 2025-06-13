import { Expose, Transform } from 'class-transformer';
import { UserType, UserTypeLabel } from 'src/enums/userType.enum';
import { Gender, GenderLabel } from 'src/enums/gender.enum';

export class UserDto {
    @Expose()
    id: string;

    @Expose()
    account: string;

    @Expose()
    fullName: string;

    @Expose()
    email: string;

    // @Expose()
    // phone: string;

    @Expose()
    jobTitle: string;

    @Expose()
    address: string;

    @Expose()
    birthDay: Date;

    @Expose()
    gender: Gender;

    @Expose()
    @Transform(({ obj }) => GenderLabel[obj.gender])
    genderLabel: string;

    @Expose()
    userType: UserType;

    @Expose()
    @Transform(({ obj }) => UserTypeLabel[obj.userType])
    userTypeLabel: string;

    @Expose()
    status: boolean;

    @Expose()
    city: string;

    @Expose()
    district: string;

    @Expose()
    ward: string;

    @Expose()
    @Transform(({ obj }) => obj.department?.name)
    departmentName: string;

    @Expose()
    @Transform(({ obj }) => obj.role?.name)
    roleName: string;

    @Expose()
    avatar: string;

}

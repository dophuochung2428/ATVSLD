import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsEmail, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Gender } from "src/enums/gender.enum";
import { UserType } from "src/enums/userType.enum";
import { REGION_LEVEL1_IDS, REGION_LEVEL1_LABELS, REGION_LEVEL2_IDS, REGION_LEVEL2_LABELS, REGION_LEVEL3_IDS, REGION_LEVEL3_LABELS } from '../department/region.constants';

export class CreateUserDto {

  @ApiProperty({ example: 'vnaIntern' })
  @IsString()
  account: string;

  @ApiProperty({
    example: 'Abcd1@34',
    description: 'Mật khẩu người dùng (mặc định là Abcd1@34 nếu không nhập)',
  })
  @IsString()
  password: string;

  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'Kỹ sư phần mềm' })
  @IsString()
  jobTitle?: string;

  @ApiProperty({ example: 'abc@gmail.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '0909123456' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '1999-05-01' })
  @IsOptional()
  @IsDateString()
  birthDay: Date;

  @ApiPropertyOptional({ example: Gender.MALE, enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    example: 'BUSINESS',
    description: 'ADMIN hoặc BUSINESS',
  })
  @IsEnum(UserType)
  userType: UserType;

  @ApiPropertyOptional({
    description: 'chỉ truyền vào nếu userType là admin',
  })
  @IsOptional()
  @IsString()
  roleId: string;

  @ApiPropertyOptional({
    description: 'chỉ truyền vào nếu userType là business',
  })
  @IsOptional()
  @IsNumber()
  departmentId?: number;

  @ApiPropertyOptional({
    enum: REGION_LEVEL1_IDS,
    example: '79'
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    enum: REGION_LEVEL2_IDS,
    example: '760'
  })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({
    enum: REGION_LEVEL3_IDS,
    example: '26734'
  })
  @IsOptional()
  @IsString()
  ward?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  @IsString()
  avatar?: string;
}

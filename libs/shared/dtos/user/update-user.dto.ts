import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Gender } from 'src/enums/gender.enum';
import { REGION_LEVEL1_IDS, REGION_LEVEL1_LABELS, REGION_LEVEL2_IDS, REGION_LEVEL2_LABELS, REGION_LEVEL3_IDS, REGION_LEVEL3_LABELS } from '../department/region.constants';
import { Transform } from 'class-transformer';


export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Nguyễn Văn A' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ example: 'Kỹ sư phần mềm' })
  @IsOptional()
  @IsString()
  jobTitle?: string;

  @ApiPropertyOptional({ example: '0909123456' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '1999-05-01' })
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => value === '' ? undefined : value)
  birthDay?: Date;

  @ApiPropertyOptional({ example: Gender.MALE, enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({
    description: 'chỉ truyền nếu là doanh nghiệp',
  })
  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @ApiPropertyOptional({
    description: 'chỉ truyền nếu là quản trị viên',
  })
  @IsOptional()
  @IsString()
  roleId?: string;

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

  @ApiPropertyOptional({
    example: true,
    description: 'Trạng thái hoạt động của user (true/false)',
  })
  @IsOptional()
  active?: boolean;
}

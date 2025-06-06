import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { BusinessType } from '../../../../src/enums/businessType.enum';
import { ApiProperty } from '@nestjs/swagger';
import { BusinessTypeLabels } from 'src/enums/business-type.labels';
import { REGION_LEVEL1_IDS, REGION_LEVEL1_LABELS, REGION_LEVEL2_IDS, REGION_LEVEL2_LABELS, REGION_LEVEL3_IDS, REGION_LEVEL3_LABELS } from './region.constants';


const BusinessTypeSwagger = Object.entries(BusinessTypeLabels).map(
  ([key, label]) => `${key} - ${label}`,
);
export class CreateDepartmentDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  tax_code?: string;

  @ApiProperty({
    description: `Loại hình doanh nghiệp (nhập một trong các giá trị sau):\n${BusinessTypeSwagger.join('\n')}`,
    enum: BusinessType,
    example: BusinessType.PRIVATE,
  })
  @IsEnum(BusinessType)
  business_type?: BusinessType;

  @ApiProperty()
  @IsString()
  business_industry_code?: string;

  @ApiProperty()
  @IsDateString()
  registration_date: Date;

  @ApiProperty({
    enum: REGION_LEVEL1_IDS,
    example: '79'
  })
  @IsString()
  region_level1_id: string; // Thay cho city

  @ApiProperty({
    enum: REGION_LEVEL2_IDS,
    example: '760'
  })
  @IsString()
  region_level2_id: string; // Thay cho district

  @ApiProperty({
    enum: REGION_LEVEL3_IDS,
    example: '26734'
  })
  @IsString()
  region_level3_id: string; // Thay cho ward

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  foreign_name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    enum: REGION_LEVEL1_IDS, required: false,
    example: '79'
  })
  @IsOptional()
  @IsString()
  operation_region_level1_id?: string;

  @ApiProperty({
    enum: REGION_LEVEL2_IDS, required: false,
    example: '760'
  })
  @IsOptional()
  @IsString()
  operation_region_level2_id?: string;

  @ApiProperty({
    enum: REGION_LEVEL3_IDS, required: false,
    example: '26734'
  })
  @IsOptional()
  @IsString()
  operation_region_level3_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  operationAddress?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  headName?: string;

  @ApiProperty({ required: true })
  @IsString()
  headEmail?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  headPhone?: string;
}

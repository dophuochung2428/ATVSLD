import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { BusinessType } from '../../../../src/enums/businessType.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDepartmentDto {
  @ApiProperty()
  @IsString()
  name: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()
  tax_code?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(BusinessType)
  business_type?: BusinessType;

  @ApiProperty()
  @IsOptional()
  @IsString()
  business_industry_code?: string;

  @ApiProperty()
  @IsDateString()
  registration_date: Date;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  district: string;

  @ApiProperty()
  @IsString()
  ward: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  foreign_name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  operationCity?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  operationDistrict?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  operationWard?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  operationAddress?: string;

  @ApiProperty()
  @IsOptional()
  headId?: number;
}

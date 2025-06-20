import { ApiProperty } from '@nestjs/swagger';
import { UpdateDepartmentDto } from './update-department.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateDepartmentWithFilesDto extends UpdateDepartmentDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'File giấy phép kinh doanh (upload mới)',
  })
  business_license?: string;

  @ApiProperty({
    type: 'string',
    required: false,
    description: 'URL để giữ nguyên giấy phép kinh doanh',
  })
  business_license_url?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'File giấy tờ khác (upload mới)',
  })
  other_document?: string;

  @ApiProperty({
    type: 'string',
    required: false,
    description: 'URL để giữ nguyên giấy tờ khác',
  })
  other_document_url?: string;
}


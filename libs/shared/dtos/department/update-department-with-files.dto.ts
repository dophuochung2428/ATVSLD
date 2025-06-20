import { ApiProperty } from '@nestjs/swagger';
import { UpdateDepartmentDto } from './update-department.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateDepartmentWithFilesDto extends UpdateDepartmentDto {
  @ApiProperty({
    type: 'string',
    required: false,
    description: 'URL của file giấy phép kinh doanh nếu muốn giữ nguyên',
  })
  @IsOptional()
  @IsString()
  business_license_url?: string;

  @ApiProperty({
    type: 'string',
    required: false,
    description: 'URL của file tài liệu khác nếu muốn giữ nguyên',
  })
  @IsOptional()
  @IsString()
  other_document_url?: string;
}


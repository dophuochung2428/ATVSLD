import { ApiProperty } from '@nestjs/swagger';
import { UpdateDepartmentDto } from './update-department.dto';

export class UpdateDepartmentWithFilesDto extends UpdateDepartmentDto {
  @ApiProperty({ type: 'string', format: 'binary', required: false, description: 'File giấy phép kinh doanh' })
  business_license?: Express.Multer.File;

  @ApiProperty({ type: 'string', format: 'binary', required: false, description: 'File tài liệu khác' })
  other_document?: Express.Multer.File;
}

import { Exclude, Expose, Type } from 'class-transformer';
import { BusinessType } from '../../../../src/enums/businessType.enum';
import { BusinessFile } from 'src/entities/business-file.entity';

class BusinessFileDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() url: string;
}
@Exclude()
export class DepartmentResponseDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() tax_code?: string;
  @Expose() business_type?: BusinessType;
  @Expose() business_type_label: string;
  @Expose() business_industry_code?: string;
  @Expose() registration_date?: Date;
  @Expose() status: boolean;

  @Expose() headName?: string;
  @Expose() headEmail?: string;
  @Expose() headPhone?: string;

  @Expose() city?: string;
  @Expose() district?: string;
  @Expose() ward?: string;
  @Expose() address?: string;

  @Expose() foreign_name?: string;
  @Expose() phone?: string;

  @Expose() operationCity?: string;
  @Expose() operationDistrict?: string;
  @Expose() operationWard?: string;
  @Expose() operationAddress?: string;

  @Expose()   
  @Type(() => BusinessFileDto)
  business_file?: BusinessFileDto[];

  // getter chỉ để lấy mảng url từ businessFiles
  @Expose({ name: 'businessFilesUrls' })
  get businessFilesUrls(): string[] {
    return this.business_file?.map(f => f.url) || [];
  }
}

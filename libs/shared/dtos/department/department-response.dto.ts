export class DepartmentResponseDto {
  id: number;
  name: string;
  tax_code?: string;
  business_type?: string;
  business_industry_code?: string;
  registration_date?: Date;
  status: boolean;
  city?: string;
  district?: string;
  ward?: string;
  address?: string;
  foreign_name?: string;
  phone?: string;
  operationCity?: string;
  operationDistrict?: string;
  operationWard?: string;
  operationAddress?: string;

  head: {
    email: string;
    fullName: string;
    phone: string;
  } | null; 
}

import { IsEnum, IsOptional, IsString } from "class-validator";

export class ReviewReportDto {
  @IsEnum(['APPROVED', 'REJECTED'])
  status: 'APPROVED' | 'REJECTED';

  @IsOptional()
  @IsString()
  reason?: string; // Lý do từ chối, bắt buộc nếu REJECTED
}

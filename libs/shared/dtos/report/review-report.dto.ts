import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf } from "class-validator";
import { ReportState } from "src/enums/report-state.enum";

export class ReviewReportDto {
  @ApiProperty({
    enum: ReportState,
    description: 'Trạng thái duyệt báo cáo: APPROVED (chấp nhận) hoặc REJECTED (từ chối)',
    example: ReportState.Approved,
  }) 
   @IsEnum(ReportState)
  status: ReportState;

    @ApiProperty({
    description: 'Lý do từ chối báo cáo. Bắt buộc nếu status là REJECTED.',
    required: false,
    example: 'Nội dung báo cáo chưa đầy đủ',
  })
  @ValidateIf(o => o.status === ReportState.Rejected)
  @IsNotEmpty({ message: 'Vui lòng nhập lý do từ chối nếu không chấp nhận báo cáo' })
  @IsString()
  reason?: string; // Lý do từ chối, bắt buộc nếu REJECTED
}

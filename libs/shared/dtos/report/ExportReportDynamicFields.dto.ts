import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ExportReportDynamicFieldsDto {
  // Lao động (a...)
  @ApiPropertyOptional() @IsOptional() @IsNumber() a1?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() a2?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() a3?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() a4?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() a5?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() a6?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() a7?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() a8?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() a9?: number;

  // Tai nạn (b...)
  @ApiPropertyOptional() @IsOptional() @IsNumber() b1?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() b2?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() b3?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() b4?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() b5?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() b6?: number;

  // Bệnh nghề nghiệp (c...)
  @ApiPropertyOptional() @IsOptional() @IsNumber() c1?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() c2?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() c3?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() c4?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() c5?: number;

  // Sức khỏe (d...)
  @ApiPropertyOptional() @IsOptional() @IsNumber() d1?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() d2?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() d3?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() d4?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() d5?: number;

  // Huấn luyện (e...)
  @ApiPropertyOptional() @IsOptional() @IsString() e1?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() e2?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() e3?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() e4?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() e5?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() e6?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() e7?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() e8?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() e9?: number;

  // Máy móc (f...)
  @ApiPropertyOptional() @IsOptional() @IsNumber() f1?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() f2?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() f3?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() f4?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() f5?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() f6?: number;

  // Thời gian làm việc (g...)
  @ApiPropertyOptional() @IsOptional() @IsNumber() g1?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() g2?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() g3?: number;

  // Bồi dưỡng độc hại (h...)
  @ApiPropertyOptional() @IsOptional() @IsNumber() h1?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() h2?: number;

  // Quan trắc môi trường (i...)
  @ApiPropertyOptional() @IsOptional() @IsNumber() i1?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() i2?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() i3?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() i4?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() i5?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() i6?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() i7?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() i8?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() i9?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() i10?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() i11?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() i12?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() i13?: string;

  // Chi phí kế hoạch (k...)
  @ApiPropertyOptional() @IsOptional() @IsNumber() k1?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() k2?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() k3?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() k4?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() k5?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() k6?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() k7?: number;

  // Dịch vụ (l...)
  @ApiPropertyOptional() @IsOptional() @IsString() l1?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() l2?: string;

  // Thời điểm đánh giá định kỳ (m1)
  @ApiPropertyOptional() @IsOptional() @IsString() m1?: string;
}

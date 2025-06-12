import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsDateString, IsOptional, IsBoolean } from 'class-validator';
import { Period } from 'src/enums/period.enum';

export class CreateReportPeriodDto {

    @ApiProperty({example: 2025})
    year: number;

    @ApiProperty({ example: 'Báo cáo ATVSLD', description: 'Mô hình báo cáo hiện tại chỉ có cái báo cáo tên này thoi' })
    @IsString()
    name: string;

    @ApiProperty({ enum: Period, example: Period.OneYear, description: 'Chu kỳ báo cáo' })
    @IsEnum(Period)
    period: Period;

    @ApiProperty({ example: '2025-01-01', description: 'Ngày bắt đầu kỳ báo cáo', type: String, format: 'date' })
    @IsDateString()
    startDate: string;

    @ApiProperty({ example: '2025-12-31', description: 'Ngày kết thúc kỳ báo cáo', type: String, format: 'date' })
    @IsDateString()
    endDate: string;

    @ApiProperty({ example: true, description: 'Trạng thái kỳ báo cáo, mặc định là true' })
    @IsBoolean()
    active?: boolean;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsDateString, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';
import { Period } from 'src/enums/period.enum';
import { ReportName } from 'src/enums/reportName.enum';

export class CreateReportPeriodDto {

    @ApiProperty({ example: 2025 })
    year: number;

    @ApiProperty({ enum: ReportName, example: ReportName.Name, description: 'Tên báo cáo' })
    @IsEnum(ReportName)
    name: ReportName;

    @ApiProperty({ enum: Period, example: Period.OneYear, description: 'Chu kỳ báo cáo' })
    @IsEnum(Period)
    period: Period;

    @IsNotEmpty({ message: 'Vui lòng nhập ngày bắt đầu' })
    @ApiProperty({ example: '2025-01-01', description: 'Ngày bắt đầu kỳ báo cáo' })
    @IsDateString()
    startDate: string;

    @IsNotEmpty({ message: 'Vui lòng nhập ngày kết thúc' })
    @ApiProperty({ example: '2025-12-31', description: 'Ngày kết thúc kỳ báo cáo' })
    @IsDateString()
    endDate: string;

    @ApiProperty({ example: true, description: 'Trạng thái kỳ báo cáo, mặc định là true' })
    @IsBoolean()
    active?: boolean;
}

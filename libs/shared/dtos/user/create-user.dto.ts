import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsEmail, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Gender } from "src/enums/gender.enum";
import { UserType } from "src/enums/userType.enum";

export class CreateUserDto {

  @ApiProperty()
  @IsString()
  account: string;

  @ApiProperty({
    example: 'Abcd1@34',
    description: 'Mật khẩu người dùng (mặc định là Abcd1@34 nếu không nhập)',
  })
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsString()
  jobTitle?: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  birthDay: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    example: 'BUSINESS',
    description: 'ADMIN hoặc BUSINESS',
  })
  @IsEnum(UserType)
  userType: UserType;

  @ApiPropertyOptional({
    description: 'chỉ truyền vào nếu userType là admin',
  })
  @IsOptional()
  @IsString()
  roleId: string;

  @ApiPropertyOptional({
    description: 'chỉ truyền vào nếu userType là business',
  })
  @IsOptional()
  @IsNumber()
  departmentId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ward?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  @IsString()
  avatar?: string;
}

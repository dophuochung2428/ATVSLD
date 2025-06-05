import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsEmail, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Gender } from "src/enums/gender.enum";
import { UserType } from "src/enums/userType.enum";

export class CreateUserDto {

  @ApiProperty()
  @IsString()
  account: string;

  @ApiProperty()
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

  @ApiPropertyOptional()
  @ApiProperty()
  @IsEnum(UserType)
  userType: UserType;

  @ApiProperty()
  @IsString()
  roleId: string;

  @ApiProperty()
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

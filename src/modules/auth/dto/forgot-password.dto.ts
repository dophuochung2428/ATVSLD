import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {

  @ApiProperty()
  @IsEmail({}, { message: 'Vui lòng nhập đúng định dạng email, định dạng đúng …..@......' })
  email: string;
}

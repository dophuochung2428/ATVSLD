import { ApiProperty } from '@nestjs/swagger';
export class LoginDto {

  @ApiProperty()
  departmentId: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}

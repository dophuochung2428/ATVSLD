import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsArray, ArrayNotEmpty } from 'class-validator';

export class UpdateRoleDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  permissionIds: string[];
}

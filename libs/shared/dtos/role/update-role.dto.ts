import { IsString, IsUUID, IsArray, ArrayNotEmpty } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  name: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  permissionIds: string[];
}

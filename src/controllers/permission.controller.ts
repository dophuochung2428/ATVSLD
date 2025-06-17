import { Controller, Get, Inject, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/modules/auth/jwt.guard";
import { Permissions } from "src/modules/auth/permissions.decorator";
import { IPermissionService } from "src/services/permission/permission.service.interface";

@ApiTags('Permission')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('permissions')
export class PermissionController {
  constructor(
        @Inject('IPermissionService')
        private readonly permissionService: IPermissionService,
    ) {}

  @Permissions('ADMIN_C_PERMISSION_VIEW')
  @Get()
  @ApiOperation({ summary: 'Get permission' })
  async getGroupedPermissions() {
    const groups = await this.permissionService.getAllGroupedPermissions();

    const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

    const result = groups.map((group, groupIndex) => ({
      stt: romanNumerals[groupIndex] || (groupIndex + 1).toString(),
      id: group.id,
      code: group.code,
      name: group.name,
      type: group.type,
      children: group.children?.map((child, childIndex) => ({
        stt: (childIndex + 1).toString(),
        id: child.id,
        code: child.code,
        name: child.name,
        type: child.type,
      })),
    }));

    return result;
  }
}

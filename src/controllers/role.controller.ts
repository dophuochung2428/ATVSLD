import { Body, Controller, Inject, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateRoleDto } from "@shared/dtos/role/create-role.dto";
import { JwtAuthGuard } from "src/modules/auth/jwt.guard";
import { IRoleService } from "src/services/role/role.service.interface";

@ApiTags('Role')
// @ApiBearerAuth('JWT-auth')
// @UseGuards(JwtAuthGuard)
@Controller('roles')
export class RoleController {
  constructor(
    @Inject('IRoleService')
    private readonly roleService: IRoleService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo một Role mới' })
  @ApiBody({ type: CreateRoleDto })
  async create(@Body() dto: CreateRoleDto) {
    return this.roleService.createRole(dto);
  }
}

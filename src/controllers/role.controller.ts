import { Body, Controller, Get, Inject, Param, ParseUUIDPipe, Post, Put, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateRoleDto } from "@shared/dtos/role/create-role.dto";
import { UpdateRoleDto } from "@shared/dtos/role/update-role.dto";
import { Role } from "src/entities/role.entity";
import { JwtAuthGuard } from "src/modules/auth/jwt.guard";
import { IRoleService } from "src/services/role/role.service.interface";

@ApiTags('Role')
// @ApiBearerAuth('JWT-auth')
// @UseGuards(JwtAuthGuard)
@Controller('roles')
export class RoleController {
  constructor(
    @Inject('IRoleService')
    private readonly roleService: IRoleService) { }

  @Post()
  @ApiOperation({ summary: 'Tạo một Role mới' })
  @ApiBody({ type: CreateRoleDto })
  async create(@Body() dto: CreateRoleDto) {
    return this.roleService.createRole(dto);
  }

  @Get(':id')
    @ApiOperation({ summary: 'Lấy danh sách Role' })
  async getById(@Param('id', ParseUUIDPipe) id: string): Promise<Role> {
    return this.roleService.getById(id);
  }

  @Put(':id') 
  @ApiOperation({ summary: 'Cập nhật Role' })
  async updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoleDto,
  ): Promise<Role> {
    return this.roleService.updateRole(id, dto);
  }

}

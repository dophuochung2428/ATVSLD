import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, ParseUUIDPipe, Post, Put, UseGuards } from "@nestjs/common";
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

  @Delete()
  @ApiOperation({ summary: 'Xóa Role được chọn' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ids: {
          type: 'array',
          items: { type: 'string' },
          example: ['id1', 'id2']
        },
      },
      required: ['ids'],
    }
  })
  async deleteRoles(@Body('ids') ids: string[]): Promise<void> {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new BadRequestException('Danh sách ids không được để trống');
    }
    await this.roleService.deleteRoles(ids);
  }

}

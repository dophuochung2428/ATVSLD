import { Controller, Get, UseGuards, Inject, Post, Body, Patch, HttpCode, HttpStatus, Param, ParseIntPipe, Query } from '@nestjs/common';
import { Department } from '../entities/department.entity';
import { JwtAuthGuard } from '../modules/auth/jwt.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { IDepartmentService } from 'src/services/department/department.service.interface';
import { CreateDepartmentDto } from '@shared/dtos/department/create-department.dto';
import { DepartmentResponseDto } from '@shared/dtos/department/department-response.dto';
import { IUserService } from 'src/services/user/user.service.interface';

@ApiTags('Department')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('departments')
export class DepartmentController {
  constructor(
    @Inject('IDepartmentService')
    private readonly departmentService: IDepartmentService,
    @Inject('IUserService')
    private readonly userService: IUserService,
  ) {}

    @Get()
    @ApiOperation({ summary: 'Get Department List' })
    async getAllDepartMents(): Promise<DepartmentResponseDto[]> {
      return this.departmentService.findAll();
    }


    @Post()
    @ApiOperation({ summary: 'Tạo một Department mới' })
    async create(@Body() createDto: CreateDepartmentDto): Promise<Department> {
      return this.departmentService.create(createDto);
    }

    @Get('mail-check-to-create')
    @ApiOperation({ summary: 'Kiểm tra email trước khi tạo Department' })
    async canCreateDepartment(@Query('email') email: string) {
      const eligible = await this.departmentService.isEligibleToCreateDepartment(email);
      if (!eligible) {
          return { eligible: false };
        }

        // Lấy user theo email để lấy phone, fullName
        const user = await this.userService.findByEmail(email);

        return {
          eligible: true,
          phone: user?.phone ?? null,
          fullName: user?.fullName ?? null,
        };
    }

    @Patch(':id/status')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Toggle trạng thái (active/inactive) của department' })
    @ApiParam({ name: 'id', type: Number, description: 'ID của phòng ban cần đổi trạng thái' })
    async toggleDepartmentStatus(
      @Param('id', ParseIntPipe) id: number,
    ): Promise<void> {
      await this.departmentService.toggleStatus(id);
    }
}

import { Controller, Get, UseGuards } from '@nestjs/common';
import { DepartmentService } from '../services/department/department.service';
import { Department } from '../entities/department.entity';
import { JwtAuthGuard } from '../modules/auth/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Department')
@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get()
  async getAllDepartMents(): Promise<Department[]> {
    return this.departmentService.findAll();
  }
}

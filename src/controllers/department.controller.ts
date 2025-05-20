import { Controller, Get, UseGuards, Inject } from '@nestjs/common';
import { DepartmentService } from '../services/department/department.service';
import { Department } from '../entities/department.entity';
import { JwtAuthGuard } from '../modules/auth/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IDepartmentService } from 'src/services/department/department.service.interface';

@ApiTags('Department')
@Controller('departments')
export class DepartmentController {
  constructor(
    @Inject('IDepartmentService')
    private readonly departmentService: IDepartmentService) {}

  @Get()
  async getAllDepartMents(): Promise<Department[]> {
    return this.departmentService.findAll();
  }
}

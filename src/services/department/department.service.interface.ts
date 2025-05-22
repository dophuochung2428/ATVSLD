import { CreateDepartmentDto } from '@shared/dtos/department/create-department.dto';
import { Department } from '../../entities/department.entity';
import { DepartmentResponseDto } from '@shared/dtos/department/department-response.dto';

export interface IDepartmentService {
  findAll(): Promise<DepartmentResponseDto[]>
  findById(id: number): Promise<Department | null>;
  create(createDto: CreateDepartmentDto): Promise<Department>
  isEligibleToCreateDepartment(email: string): Promise<boolean>
  toggleStatus(id: number): Promise<void>
}

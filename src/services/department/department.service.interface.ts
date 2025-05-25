import { CreateDepartmentDto } from '@shared/dtos/department/create-department.dto';
import { Department } from '../../entities/department.entity';
import { DepartmentResponseDto } from '@shared/dtos/department/department-response.dto';
import { UpdateDepartmentDto } from '@shared/dtos/department/update-department.dto';

export interface IDepartmentService {
  findAll(): Promise<DepartmentResponseDto[]>
  findById(id: number): Promise<Department | null>
  checkUserCanBeHead(email: string)
  create(
      createDto: CreateDepartmentDto,
        files: {
        business_license?: Express.Multer.File[],
        other_document?: Express.Multer.File[],
      }
    ): Promise<Department>
  toggleStatus(id: number): Promise<void>
  deleteOne(id: number): Promise<void>
  deleteMany(ids: number[]): Promise<{ deleted: number }>
  update(
        id: number,
        updateDto: UpdateDepartmentDto,
        files?: {
          business_license?: Express.Multer.File[],
          other_document?: Express.Multer.File[],
        },
      ): Promise<Department>
}

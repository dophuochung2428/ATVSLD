import { CreateDepartmentDto } from '@shared/dtos/department/create-department.dto';
import { Department } from '../../entities/department.entity';
import { DepartmentResponseDto } from '@shared/dtos/department/department-response.dto';
import { UpdateDepartmentDto } from '@shared/dtos/department/update-department.dto';
import { PaginationQueryDto } from '@shared/dtos/pagination/pagination-query.dto';
import { Response } from 'express';

export interface IDepartmentService {
  findAll(pagination: PaginationQueryDto)
  findById(id: string): Promise<Department | null>
  checkUserCanBeHead(email: string)
  create(
    createDto: CreateDepartmentDto,
    files: {
      business_license?: Express.Multer.File[],
      other_document?: Express.Multer.File[],
    }
  ): Promise<Department>
  toggleStatus(id: string): Promise<void>
  deleteOne(id: string): Promise<void>
  deleteMany(ids: string[]): Promise<{ deleted: number }>
  update(id: string, updateDto: UpdateDepartmentDto,
    files?: {
      business_license?: (Express.Multer.File | string)[],
      other_document?: (Express.Multer.File | string)[],
    },
  ): Promise<Department>
  exportToExcel(ids: string[], res: Response): Promise<void>
  checkTaxCode(tax_code: string): Promise<{ isAvailable: boolean; message: string }>
  importFromExcel(file: Express.Multer.File): Promise<{
    createdDepartments: Department[];
    errors: string[];
  }>
  getActiveDepartments(): Promise<Department[]>
}

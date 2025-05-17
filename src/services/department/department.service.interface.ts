import { Department } from '../../entities/department.entity';

export interface IDepartmentService {
  findAll(): Promise<Department[]>;
  findById(id: number): Promise<Department | null>;
}

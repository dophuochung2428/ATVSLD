import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '../../entities/department.entity';
import { IDepartmentService } from './department.service.interface';

@Injectable()
export class DepartmentService implements IDepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}

  async findAll(): Promise<Department[]> {
    return this.departmentRepository.find();
  }

  async findById(id: number): Promise<Department | null> {
    return this.departmentRepository.findOneBy({ id });
  }


}

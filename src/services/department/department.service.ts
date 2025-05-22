import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '../../entities/department.entity';
import { User } from '../../entities/user.entity';
import { IDepartmentService } from './department.service.interface';
import { CreateDepartmentDto } from '@shared/dtos/department/create-department.dto';
import { DepartmentResponseDto } from '@shared/dtos/department/department-response.dto';


@Injectable()
export class DepartmentService implements IDepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<DepartmentResponseDto[]> {
    return this.departmentRepository
      .createQueryBuilder('department')
      .leftJoinAndSelect('department.head', 'head')
      .select([
        'department',
        'head.email',
        'head.fullName',
        'head.phone',
      ])
      .getMany();
  }

  async findById(id: number): Promise<Department | null> {
    return this.departmentRepository.findOneBy({ id });
  }

    async create(createDto: CreateDepartmentDto): Promise<Department> {
    const department = this.departmentRepository.create(createDto);

    if (createDto.headId) {
      const head = await this.userRepository.findOneBy({ id: createDto.headId });
      if (!head) throw new Error('Head user not found');
      department.head = head;
    }

    return this.departmentRepository.save(department);
  }


  async isEligibleToCreateDepartment(email: string): Promise<boolean> {
    try {
      const user = await this.userRepository.findOne({
        where: { email, department: null },
      });

      if (!user) {
        throw new BadRequestException({
          message: 'Người dùng không hợp lệ để thực hiện thao tác này.',
          code: 'USER_NOT_ELIGIBLE',
        });
      }

      const isHead = await this.departmentRepository.findOne({
        where: { head: { id: user.id } },
      });

      if (isHead) {
        throw new BadRequestException({
          message: 'Người dùng không hợp lệ để thực hiện thao tác này.',
          code: 'USER_NOT_ELIGIBLE',
        });
      }

      return true;
    } catch (error) {
      throw error;
    }
  }



  async toggleStatus(id: number): Promise<void> {
    const department = await this.departmentRepository.findOneBy({ id });
    if (!department) {
      throw new NotFoundException(`Không tìm thấy Department với id:  ${id} `);
    }

    department.status = !department.status;

    await this.departmentRepository.save(department);
  }


}

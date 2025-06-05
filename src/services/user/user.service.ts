import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { IUserService } from './user.service.interface';
import { CreateUserDto } from '@shared/dtos/user/create-user.dto';
import { Role } from 'src/entities/role.entity';
import { Department } from 'src/entities/department.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) { }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findUserById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['role', 'department'],
    });
  }


  async findById(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role', 'role.rolePermissions', 'role.rolePermissions.permission'],
    });
    if (user) {
      delete user.password;
    }
    return user;
  }

  async findByIdWithStatusTrue(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id, status: true },
      relations: {
        role: {
          rolePermissions: {
            permission: true,
          },
        },
      },
    });

    if (user) {
      user.role.rolePermissions = user.role.rolePermissions.filter(rp => rp.status);
      delete user.password;
    }

    return user;
  }


  async findByAccount(account: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { account },
      relations: ['role'],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['department'],
    });
  }

  async findByAccountWithDepartment(account: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { account },
      relations: ['department'],
    });
  }

  /////////////////////
  async updatePassword(userId: number, hashedPassword: string): Promise<void> {
    await this.userRepository.update(userId, { password: hashedPassword });
  }


  async create(dto: CreateUserDto): Promise<User> {
    const { departmentId, roleId, ...rest } = dto;

    const user = this.userRepository.create(rest);
    user.password = await bcrypt.hash(rest.password, 10);

    if (departmentId) {
      const department = await this.departmentRepository.findOneBy({ id: departmentId });
      if (!department) throw new NotFoundException('Department not found');
      user.department = department;
    }

    const role = await this.roleRepository.findOneBy({ id: roleId });
    if (!role) throw new NotFoundException('Role not found');
    user.role = role;

    return this.userRepository.save(user);
  }


}

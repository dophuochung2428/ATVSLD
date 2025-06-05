import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { IUserService } from './user.service.interface';
import { CreateUserDto } from '@shared/dtos/user/create-user.dto';
import { Role } from 'src/entities/role.entity';
import { Department } from 'src/entities/department.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '@shared/dtos/user/update-user.dto';
import { UserType } from 'src/enums/userType.enum';
import { IRoleService } from '../role/role.service.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @Inject('IRoleService')
    private readonly roleService: IRoleService,
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

  // async findByIdWithStatusTrue(id: number): Promise<User | null> {
  //   const user = await this.userRepository.findOne({
  //     where: { id, status: true },
  //     relations: {
  //       role: {
  //         rolePermissions: {
  //           permission: true,
  //         },
  //       },
  //     },
  //   });

  //   if (user) {
  //     user.role.rolePermissions = user.role.rolePermissions.filter(rp => rp.status);
  //     delete user.password;
  //   }

  //   return user;
  // }


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
    const { departmentId, roleId, userType, ...rest } = dto;

    const user = this.userRepository.create(rest);
    user.password = await bcrypt.hash(rest.password, 10);

    if (userType === UserType.BUSINESS) {
      if (!departmentId) {
        throw new BadRequestException('Department is required for Business user');
      }
      if (roleId) {
        throw new BadRequestException('Business user should not have a roleId');
      }
      const department = await this.departmentRepository.findOneBy({ id: departmentId });
      if (!department) throw new NotFoundException('Department not found');
      user.department = department;

      const role = await this.roleService.getByCode("USER");
      if (!role) throw new NotFoundException('Role for Business  User not found');
      user.role = role;

      if (department.headEmail) {
        user.email = department.headEmail;
      }
    }
    else if (userType === UserType.ADMIN) {
      if (!roleId) {
        throw new BadRequestException('Role is required for Admin user');
      }
      if (departmentId) {
        throw new BadRequestException('Admin user should not have a departmentId');
      }
      const role = await this.roleRepository.findOneBy({ id: roleId });
      if (!role) throw new NotFoundException('Role not found');
      user.role = role;
      user.department = null;
    }
    else {
      throw new BadRequestException('Invalid userType');
    }
    return this.userRepository.save(user);
  }


  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role', 'department'],
    });
    if (!user) throw new NotFoundException('User not found');

    if (user.userType === UserType.ADMIN) {
      if (dto.departmentId && dto.departmentId !== user.department?.id) {
        throw new BadRequestException('Admin user cannot update department');
      }
      if (dto.roleId && dto.roleId !== user.role?.id) {
        const role = await this.roleRepository.findOneBy({ id: dto.roleId });
        if (!role) throw new NotFoundException('Role not found');
        user.role = role;
      }
    } else if (user.userType === UserType.BUSINESS) {
      if (dto.roleId && dto.roleId !== user.role?.id) {
        throw new BadRequestException('Business user cannot update role');
      }
      if (dto.departmentId && dto.departmentId !== user.department?.id) {
        const department = await this.departmentRepository.findOneBy({ id: dto.departmentId });
        if (!department) throw new NotFoundException('Department not found');
        user.department = department;
      }
    }
    Object.assign(user, dto);
    user.status = dto.active;
    return this.userRepository.save(user);
  }

  async deleteMany(ids: number[]): Promise<void> {
    const users = await this.userRepository.findBy({ id: In(ids) });
    if (!users.length) throw new NotFoundException('No users found to delete');

    await this.userRepository.remove(users);
  }


}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { IUserService } from './user.service.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
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
    const user = await this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('role.rolePermissions', 'rolePermissions', 'rolePermissions.status = :status', { status: true })
      .leftJoinAndSelect('rolePermissions.permission', 'permission')
      .where('user.id = :id', { id })
      .getOne();
    if (user) {
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

  async updatePassword(userId: number, hashedPassword: string): Promise<void> {
    await this.userRepository.update(userId, { password: hashedPassword });
  }


}

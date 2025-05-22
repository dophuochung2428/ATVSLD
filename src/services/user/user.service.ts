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
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
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
        select: ['phone', 'fullName'],
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

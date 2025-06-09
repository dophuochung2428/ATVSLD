import { CreateUserDto } from '@shared/dtos/user/create-user.dto';
import { User } from '../../entities/user.entity';
import { UpdateUserDto } from '@shared/dtos/user/update-user.dto';
import { Response } from 'express';

export interface IUserService {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findUserById(id: string): Promise<User | null>
  findByAccount(account: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByAccountWithDepartment(account: string): Promise<User | null>;
  findPermissionWithRoleId(id: string): Promise<User | null>
  updatePassword(userId: string, hashedPassword: string): Promise<void>;
  create(dto: CreateUserDto): Promise<User>
  update(id: string, dto: UpdateUserDto): Promise<User>
  deleteMany(ids: string[]): Promise<void>
  toggleStatus(id: string): Promise<void>
  resetPassword(userId: string): Promise<void>
  exportUsersToExcel(ids: string[], res: Response): Promise<void>
  createUsersFromExcel(buffer: Buffer): Promise<{ createdUsers: User[]; errors: string[] }>
  findByAccountWithPassword(account: string): Promise<User | null>
}

import { CreateUserDto } from '@shared/dtos/user/create-user.dto';
import { User } from '../../entities/user.entity';
import { UpdateUserDto } from '@shared/dtos/user/update-user.dto';

export interface IUserService {
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findUserById(id: number): Promise<User | null>
  findByAccount(account: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByAccountWithDepartment(account: string): Promise<User | null>;
  findPermissionWithRoleId(id: number): Promise<User | null>
  updatePassword(userId: number, hashedPassword: string): Promise<void>;
  create(dto: CreateUserDto): Promise<User>
  update(id: number, dto: UpdateUserDto): Promise<User>
  deleteMany(ids: number[]): Promise<void>
}

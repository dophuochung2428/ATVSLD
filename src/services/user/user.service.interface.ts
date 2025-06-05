import { CreateUserDto } from '@shared/dtos/user/create-user.dto';
import { User } from '../../entities/user.entity';

export interface IUserService {
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findUserById(id: number): Promise<User | null>
  findByAccount(account: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByAccountWithDepartment(account: string): Promise<User | null>;
  findByIdWithStatusTrue(id: number): Promise<User | null>
  updatePassword(userId: number, hashedPassword: string): Promise<void>;
  create(dto: CreateUserDto): Promise<User>
}

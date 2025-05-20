import { User } from '../../../entities/user.entity';
import { LoginDto } from '../dto/login.dto';

export interface IAuthService {
  validateUser(username: string, password: string): Promise<User | null>;
  login(loginDto: LoginDto): Promise<{ access_token: string }>;
  forgotPassword(email: string): Promise<string>;
  resetPassword(token: string, newPassword: string): Promise<{ message: string }>;
}

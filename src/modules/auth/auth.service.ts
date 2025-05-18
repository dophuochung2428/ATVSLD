import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../services/user/user.service'; 
import { MailService } from '../mail/mail.service';
import { User } from '../../entities/user.entity';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async validateUser(username: string, password: string, departmentId: number): Promise<User | null> {
    const user = await this.userService.findByAccountWithDepartment(username);
    if (!user) {
      throw new UnauthorizedException('Tài khoản không tồn tại');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Mật khẩu không chính xác');
    }

    if (user.department?.id !== departmentId) {
      throw new UnauthorizedException('Đơn vị không khớp');
    }

    return user;
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.validateUser(loginDto.username, loginDto.password, loginDto.departmentId);
    const payload = { username: user.account, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async forgotPassword(email: string): Promise<string> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('Email chưa đăng ký trong hệ thống, xin vui lòng thử lại sau');
    }

    // Create new pass
    const newPassword = this.generateRandomPassword();
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update new pass to data base
    await this.userService.updatePassword(user.id, hashedPassword);

    // Send email
    const loginUrl = 'https://your-frontend/login'; 
    await this.mailService.sendPasswordRecoveryEmail(user.email, newPassword, loginUrl, user.account, user.department.name);

    return 'Mật khẩu mới đã được gửi qua email. Vui lòng kiểm tra hộp thư!';
  }

  private generateRandomPassword(): string {
    return Math.random().toString(36).slice(-8); // VD: "a1b2c3d4"
  }


}

import { Injectable, UnauthorizedException, BadRequestException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../services/user/user.service';
import { MailService } from '../mail/mail.service';
import { User } from '../../entities/user.entity';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { ResetPasswordPayload } from './interfaces/reset-password-payload.interface';
import { NotFoundException } from '@nestjs/common';
import { IAuthService } from './interfaces/auth-service.interface';
import { IUserService } from 'src/services/user/user.service.interface';
@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject('IUserService')
    private readonly userService: IUserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) { }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userService.findByAccountWithPassword(username);
    if (!user) {
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng. Xin vui lòng thử lại');
    }
    if (!user.status) {
      throw new UnauthorizedException('Tài khoản của bạn đang bị khóa.');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng. Xin vui lòng thử lại');
    }

    return user;
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.validateUser(loginDto.username, loginDto.password);

    if (!loginDto.username || !loginDto.password) {
      throw new BadRequestException('Vui lòng nhập đầy đủ tài khoản và mật khẩu.');
    }

    const payload = {
      sub: user.id,
      role: user.role.code,
      roleId: user.role.id,
      ...(user.department?.id && { departmentId: user.department.id }),
    };
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

    // Update new pass to data base
    await this.userService.updatePassword(user.id, newPassword);

    // Send email
    const loginUrl = 'https://your-frontend/login';
    const departmentName = user.department?.name ?? 'Phòng ban không xác định';
    await this.mailService.sendPasswordRecoveryEmail(user.email, newPassword, loginUrl, user.account, departmentName);

    return 'Mật khẩu mới đã được gửi qua email. Vui lòng kiểm tra hộp thư!';
  }

  private generateRandomPassword(): string {
    return Math.random().toString(36).slice(-8);
  }

}

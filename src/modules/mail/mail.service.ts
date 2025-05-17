import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendPasswordRecoveryEmail(email: string, newPassword: string, loginUrl: string, username: string, departmentName: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Hệ thống chuyển đổi số DTI thông báo thông tin mật khẩu mới',
      template: './reset-password', 
      context: {
        password: newPassword,
        loginUrl,
        username,
        departmentName
      },
    });
  }
}

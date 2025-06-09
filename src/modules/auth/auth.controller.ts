import { Controller, Post, Body, Inject } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { IAuthService } from './interfaces/auth-service.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('IAuthService')
    private readonly authService: IAuthService,
  ) {}

    @Post('login')
    @ApiOperation({ summary: 'Đăng nhập' })
    async login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
      return this.authService.login(loginDto);
    }

    @Post('forgot-password')
    @ApiOperation({ summary: 'Quên mật khẩu' })
    async forgotPassword(@Body() dto: ForgotPasswordDto) {
      return this.authService.forgotPassword(dto.email);
    }

    // @Post('reset-password')
    // @ApiOperation({ summary: 'Đổi mật khẩu(chưa hoàn thiện)' })
    // async resetPassword(@Body() dto: ResetPasswordDto){
    //   return  this.authService.resetPassword(dto.token, dto.newPassword);
    // }

}

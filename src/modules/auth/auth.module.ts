import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { MailModule } from '../mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PermissionsGuard } from './permissions.guard';

@Module({
  imports: [
    PassportModule,
    UserModule,
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [
    {
      provide: 'IAuthService',
      useClass: AuthService,
    },
    JwtStrategy,
    PermissionsGuard,
  ],
  controllers: [AuthController],
  exports: ['IAuthService', PermissionsGuard],
})
export class AuthModule {}

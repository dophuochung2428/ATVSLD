import { Controller, Get, UseGuards, Inject } from '@nestjs/common';
import { UserService } from '../services/user/user.service';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from '../modules/auth/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IUserService } from 'src/services/user/user.service.interface';

@ApiTags('User')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UserController {
  constructor(
      @Inject('IUserService')
      private readonly userService: IUserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }
}

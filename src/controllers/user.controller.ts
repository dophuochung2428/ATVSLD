import { Controller, Get, UseGuards, Inject, Query } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from '../modules/auth/jwt.guard';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { IUserService } from 'src/services/user/user.service.interface';

@ApiTags('User')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(
      @Inject('IUserService')
      private readonly userService: IUserService) {}

  @Get()
  @ApiOperation({ summary: 'Get User List' })
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

}

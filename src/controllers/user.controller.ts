import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user/user.service';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from '../modules/auth/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }
}

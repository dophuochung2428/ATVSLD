import { Controller, Get, UseGuards, Inject, Query, Param, ParseIntPipe, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from '../modules/auth/jwt.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { IUserService } from 'src/services/user/user.service.interface';
import { plainToInstance } from 'class-transformer';
import { UserDto } from '@shared/dtos/user/user.dto';
import { CreateUserDto } from '@shared/dtos/user/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ICloudinaryService } from 'src/services/cloudinary/cloudinary.service.interface';

@ApiTags('User')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(
    @Inject('IUserService')
    private readonly userService: IUserService,
    @Inject('ICloudinaryService')
    private readonly cloudinaryService: ICloudinaryService,
  ) { }

  @Get()
  @ApiOperation({ summary: 'Get User List' })
  async getAllUsers(): Promise<UserDto[]> {
    const users = await this.userService.findAll();
    return plainToInstance(UserDto, users, { excludeExtraneousValues: true });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get User By ID' })
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    const user = await this.userService.findById(id);
    return plainToInstance(UserDto, user, { excludeExtraneousValues: true });
  }

  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOperation({ summary: 'Create new user' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateUserDto })
  async createUser(
    @UploadedFile() avatarFile: Express.Multer.File,
    @Body() dto: CreateUserDto
  ): Promise<UserDto> {
    if (avatarFile) {
      const uploadResult = await this.cloudinaryService.uploadFile(avatarFile);
      dto.avatar = uploadResult.secure_url;
    }

    const newUser = await this.userService.create(dto);
    return plainToInstance(UserDto, newUser, { excludeExtraneousValues: true });
  }



}

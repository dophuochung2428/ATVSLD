import { Controller, Get, UseGuards, Inject, Query, Param, ParseIntPipe, Post, Body, UseInterceptors, UploadedFile, Put, Delete, Patch, HttpCode, HttpStatus, Res, BadRequestException, ParseUUIDPipe, HttpException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from '../modules/auth/jwt.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { IUserService } from 'src/services/user/user.service.interface';
import { plainToInstance } from 'class-transformer';
import { UserDto } from '@shared/dtos/user/user.dto';
import { CreateUserDto } from '@shared/dtos/user/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ICloudinaryService } from 'src/services/cloudinary/cloudinary.service.interface';
import { UpdateUserDto } from '@shared/dtos/user/update-user.dto';
import { Response } from 'express';
import { Permissions } from 'src/modules/auth/permissions.decorator';

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

  @Permissions('ADMIN_C_USER_VIEW')
  @Get('check-account')
  @ApiOperation({ summary: 'Kiểm tra có tài khoản trùng ko' })
  @ApiQuery({ name: 'account', required: false })
  async checkAccountExists(@Query('account') account: string) {
    if (!account) return { exists: false };

    const user = await this.userService.findByAccount(account).catch(() => null);
    return { exists: !!user };
  }

  @Permissions('ADMIN_C_USER_VIEW')
  @Get('check-email')
  @ApiOperation({ summary: 'Kiểm tra có email trùng ko' })
  @ApiQuery({ name: 'email', required: false })
  async checkEmailExists(@Query('email') email: string) {
    if (!email) return { exists: false };

    const user = await this.userService.findByEmail(email).catch(() => null);
    return { exists: !!user };
  }
  // @Permissions('ADMIN_C_USER_VIEW')
  @Get('by-account/:account')
  @ApiOperation({ summary: 'Get User by Account' })
  @ApiParam({ name: 'account', type: 'string', description: 'Account name (username)' })
  async getUserByAccount(@Param('account') account: string): Promise<UserDto> {
    const user = await this.userService.findByAccount(account);
    return plainToInstance(UserDto, user, { excludeExtraneousValues: true });
  }

  // @Permissions('ADMIN_C_USER_VIEW')
  @Get('by-email/:email')
  @ApiOperation({ summary: 'Get User by Email' })
  @ApiParam({ name: 'email', type: 'string', description: 'Email của user' })
  async getUserByEmail(@Param('email') email: string): Promise<UserDto> {
    const user = await this.userService.findByEmail(email);
    return plainToInstance(UserDto, user, { excludeExtraneousValues: true });
  }

  // @Permissions('ADMIN_C_USER_VIEW')
  @Get(':id')
  @ApiOperation({ summary: 'Get User By ID' })
  async getUserById(@Param('id', ParseUUIDPipe) id: string): Promise<UserDto> {
    const user = await this.userService.findById(id);
    return plainToInstance(UserDto, user, { excludeExtraneousValues: true });
  }

  // @Permissions('ADMIN_C_USER_VIEW')
  @Get()
  @ApiOperation({ summary: 'Get User List' })
  async getAllUsers(): Promise<UserDto[]> {
    const users = await this.userService.findAll();
    return plainToInstance(UserDto, users, { excludeExtraneousValues: true });
  }

  @Permissions('ADMIN_C_USER_CREATE')
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

  @Permissions('ADMIN_C_USER_UPDATE')
  @Put(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update user' })
  @ApiBody({ type: UpdateUserDto })
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() avatarFile: Express.Multer.File,
    @Body() dto: UpdateUserDto
  ): Promise<UserDto> {
    if (avatarFile) {
      const uploadResult = await this.cloudinaryService.uploadFile(avatarFile);
      dto.avatar = uploadResult.secure_url;
    }

    const updated = await this.userService.update(id, dto);
    return plainToInstance(UserDto, updated, { excludeExtraneousValues: true });
  }

  @Permissions('ADMIN_C_USER_UPDATE')
  @Put(':id/reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Reset mật khẩu về mặc định: Abcd1@34' })
  @ApiParam({ name: 'id', type: String, description: 'ID của user cần đổi mk' })
  async resetPassword(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.userService.resetPassword(id);
  }

  @Permissions('ADMIN_C_USER_DELETE')
  @Delete()
  @ApiOperation({ summary: 'Delete one or many users by ID(s)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ids: {
          type: 'array',
          items: { type: 'string' },
          example: ['id1', 'id2']
        }
      },
      required: ['ids']
    }
  })
  async deleteUsers(@Body('ids') ids: string[]): Promise<void> {
    await this.userService.deleteMany(ids);
  }

  @Permissions('ADMIN_C_USER_UPDATE')
  @Patch(':id/status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Toggle trạng thái (active/inactive) của user' })
  @ApiParam({ name: 'id', type: String, description: 'ID của user cần đổi trạng thái' })
  async toggleUserStatus(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.userService.toggleStatus(id);
  }

  @Permissions('ADMIN_C_USER_VIEW')
  @Post('export-excel')
  @ApiOperation({ summary: 'Export danh sách User ra Excel' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ids: {
          type: 'array',
          items: { type: 'string' },
          example: ['id1', 'id2']
        },
      },
      required: ['ids'],
    }
  })
  async exportExcel(@Body() body: { ids: string[] }, @Res() res: Response): Promise<void> {
    if (!body.ids || body.ids.length === 0) {
      throw new BadRequestException('Vui lòng chọn ít nhất một user để xuất Excel.');
    }
    await this.userService.exportUsersToExcel(body.ids, res);
  }


  @Permissions('ADMIN_C_USER_CREATE')
  @Post('import-excel')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Excel file để import user',
        },
      },
    },
  })
  async importUsersFromExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file || !file.buffer) {
      throw new HttpException('File không hợp lệ hoặc thiếu file Excel.', HttpStatus.BAD_REQUEST);
    }

    const result = await this.userService.createUsersFromExcel(file.buffer);

    if (result.createdUsers.length === 0) {
      throw new HttpException(
        {
          message: 'Không tạo được người dùng nào từ file Excel.',
          errors: result.errors,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      message: 'Import thành công',
      createdCount: result.createdUsers.length,
      errors: result.errors,
    };
  }

}

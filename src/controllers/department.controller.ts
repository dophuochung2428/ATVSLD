import { Controller, Get, UseGuards, Inject, Post, Body, Patch, HttpCode, HttpStatus, Param, ParseIntPipe, Query, UseInterceptors, UploadedFiles, Delete, Put, Res, BadRequestException, UploadedFile, ParseUUIDPipe } from '@nestjs/common';
import { Department } from '../entities/department.entity';
import { JwtAuthGuard } from '../modules/auth/jwt.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { IDepartmentService } from 'src/services/department/department.service.interface';
import { IUserService } from 'src/services/user/user.service.interface';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { CreateDepartmentWithFilesDto } from '@shared/dtos/department/create-department-with-file.dto';
import { DeleteManyDto } from '@shared/dtos/department/delete-many.dto';
import { UpdateDepartmentWithFilesDto } from '@shared/dtos/department/update-department-with-files.dto';
import { PaginationQueryDto } from '@shared/dtos/pagination/pagination-query.dto';
import { Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { DepartmentResponseDto } from '@shared/dtos/department/department-response.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Permissions } from 'src/modules/auth/permissions.decorator';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from 'src/modules/auth/permissions.guard';

@ApiTags('Business')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('departments')
export class DepartmentController {
  constructor(
    @Inject('IDepartmentService')
    private readonly departmentService: IDepartmentService,
    @Inject('IUserService')
    private readonly userService: IUserService,
  ) { }

  @Permissions('ADMIN_C_DEPARTMENT_VIEW')
  @UseGuards(PermissionsGuard)
  @Get()
  @ApiOperation({ summary: 'Get danh sách doanh nghiệp( có phân trang)' })
  async getAllDepartMents(@Query() query: PaginationQueryDto) {
    return this.departmentService.findAll(query);
  }

  @Get('active')
  @ApiOperation({ summary: 'Lấy danh sách doanh nghiệp đang hoạt động' })
  async getActiveDepartments() {
    return this.departmentService.getActiveDepartments();
  }

  @Permissions('ADMIN_C_DEPARTMENT_CREATE')
  @Post()
  @ApiOperation({ summary: 'Tạo một doanh nghiệp mới' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateDepartmentWithFilesDto })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'business_license', maxCount: 1 },
      { name: 'other_document', maxCount: 1 },
    ]),
  )
  async create(
    @Body() createDto: CreateDepartmentWithFilesDto,
    @UploadedFiles()
    files: {
      business_license?: Express.Multer.File[],
      other_document?: Express.Multer.File[],
    },
  ): Promise<Department> {
    return this.departmentService.create(createDto, files);
  }

  @Get('mail-check-to-create')
  @ApiOperation({ summary: 'Kiểm tra email trước khi tạo doanh nghiệp' })
  async canCreateDepartment(@Query('email') email: string) {
    try {
      const user = await this.departmentService.checkUserCanBeHead(email);

      return {
        eligible: true
      };
    } catch {
      return {
        eligible: false
      };
    }
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Toggle trạng thái (active/inactive) của doanh nghiệp' })
  @ApiParam({ name: 'id', type: String, description: 'ID của doanh nghiệp cần đổi trạng thái' })
  async toggleDepartmentStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    await this.departmentService.toggleStatus(id);
  }

  @Permissions('ADMIN_C_DEPARTMENT_DELETE')
  @ApiOperation({ summary: 'Xóa 1 doanh nghiệp theo id' })
  @Delete(':id')
  async deleteOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.departmentService.deleteOne(id);
  }

  @Permissions('ADMIN_C_DEPARTMENT_DELETE')
  @ApiOperation({ summary: 'Xóa nhiều doanh nghiệp theo id' })
  @Delete()
  async deleteMany(@Body() body: DeleteManyDto) {
    return this.departmentService.deleteMany(body.ids);
  }

  @Permissions('ADMIN_C_DEPARTMENT_UPDATE')
  @ApiOperation({ summary: 'Cập nhật doanh nghiệp theo id' })
  @Put(':id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'business_license', maxCount: 1 },
    { name: 'other_document', maxCount: 1 },
  ]))
  @ApiConsumes('multipart/form-data')
  async updateDepartment(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDto: UpdateDepartmentWithFilesDto,
    @UploadedFiles()
    files: {
      business_license?: Express.Multer.File[],
      other_document?: Express.Multer.File[],
    },
  ) {
    // return this.departmentService.update(id, updateDto, files);

    const department = await this.departmentService.update(id, updateDto, files);

    // Chuyển entity sang DTO
    const dto = plainToInstance(DepartmentResponseDto, department, {
      excludeExtraneousValues: true,
    });

    return dto;
  }

  @Post('export')
  @ApiOperation({ summary: 'Export danh sách ra Excel' })
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
      throw new BadRequestException('Vui lòng chọn ít nhất một phòng ban để xuất Excel.');
    }
    await this.departmentService.exportToExcel(body.ids, res);
  }

  @Permissions('ADMIN_C_DEPARTMENT_CREATE')
  @Post('import-excel')
  @ApiOperation({ summary: 'Thêm bằng file excel' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(@UploadedFile() file: Express.Multer.File) {
    return this.departmentService.importFromExcel(file);
  }

  @ApiOperation({ summary: 'Check mã số thuế' })
  @Get('check-tax-code')
  async checkTaxCode(@Query('taxCode') taxCode: string) {
    if (!taxCode?.trim()) {
      throw new BadRequestException('Thiếu mã số thuế');
    }

    return await this.departmentService.checkTaxCode(taxCode.trim());
  }

  @ApiOperation({ summary: 'Lấy chi tiết doanh nghiệp theo ID' })
  @ApiParam({ name: 'id', description: 'ID của phòng ban' })
  @Get(':id')
  async getDepartmentById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.departmentService.findById(id);
  }





}

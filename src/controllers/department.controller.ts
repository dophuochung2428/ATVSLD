import { Controller, Get, UseGuards, Inject, Post, Body, Patch, HttpCode, HttpStatus, Param, ParseIntPipe, Query, UseInterceptors, UploadedFiles, Delete, Put, Res } from '@nestjs/common';
import { Department } from '../entities/department.entity';
import { JwtAuthGuard } from '../modules/auth/jwt.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { IDepartmentService } from 'src/services/department/department.service.interface';
import { IUserService } from 'src/services/user/user.service.interface';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateDepartmentWithFilesDto } from '@shared/dtos/department/create-department-with-file.dto';
import { DeleteManyDto } from '@shared/dtos/department/delete-many.dto';
import { UpdateDepartmentWithFilesDto } from '@shared/dtos/department/update-department-with-files.dto';
import { PaginationQueryDto } from '@shared/dtos/pagination/pagination-query.dto';
import { Response } from 'express';

@ApiTags('Department')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('departments')
export class DepartmentController {
  constructor(
    @Inject('IDepartmentService')
    private readonly departmentService: IDepartmentService,
    @Inject('IUserService')
    private readonly userService: IUserService,
  ) {}

    @Get()
    @ApiOperation({ summary: 'Get Department List( có phân trang)' })
    async getAllDepartMents(@Query() query: PaginationQueryDto) {
      return this.departmentService.findAll(query);
    }


    @Post()
    @ApiOperation({ summary: 'Tạo một Department mới' })
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
    @ApiOperation({ summary: 'Kiểm tra email trước khi tạo Department' })
    async canCreateDepartment(@Query('email') email: string) {
      try {
          const user = await this.departmentService.checkUserCanBeHead(email);

          return {
            eligible: true
          };
        } catch  {
          return {
            eligible: false
          };
        }
    }

    @Patch(':id/status')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Toggle trạng thái (active/inactive) của department' })
    @ApiParam({ name: 'id', type: Number, description: 'ID của phòng ban cần đổi trạng thái' })
    async toggleDepartmentStatus(
      @Param('id', ParseIntPipe) id: number,
    ): Promise<void> {
      await this.departmentService.toggleStatus(id);
    }

    @ApiOperation({ summary: 'Xóa 1 department theo id' })
    @Delete(':id')
      async deleteOne(@Param('id', ParseIntPipe) id: number) {
        return this.departmentService.deleteOne(id);
    }

    @ApiOperation({ summary: 'Xóa nhiều department theo id' })
    @Delete()
    async deleteMany(@Body() body: DeleteManyDto) {
      return this.departmentService.deleteMany(body.ids);
    }

    @ApiOperation({ summary: 'Cập nhật department theo id' })
    @Put(':id')
    @UseInterceptors(FileFieldsInterceptor([
      { name: 'business_license', maxCount: 1 },
      { name: 'other_document', maxCount: 1 },
    ]))
    @ApiConsumes('multipart/form-data')
    async updateDepartment(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateDto: UpdateDepartmentWithFilesDto,
      @UploadedFiles()
      files: {
        business_license?: Express.Multer.File[],
        other_document?: Express.Multer.File[],
      },
    ) {
      return this.departmentService.update(id, updateDto, files);
    }

    @Get('export')
    @ApiOperation({ summary: 'Export danh sách ra Excel' })
    async exportExcel(@Res() res: Response): Promise<void> {
      await this.departmentService.exportToExcel(res);
    }

    @ApiOperation({ summary: 'Lấy chi tiết phòng ban theo ID' })
    @ApiParam({ name: 'id', description: 'ID của phòng ban' })
    @Get(':id')
    async getDepartmentById(@Param('id') id: number) {
      return this.departmentService.findById(id);
    }




}

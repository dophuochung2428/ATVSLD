import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, DataSource, QueryRunner } from 'typeorm';
import { Department } from '../../entities/department.entity';
import { User } from '../../entities/user.entity';
import { IDepartmentService } from './department.service.interface';
import { CreateDepartmentDto } from '@shared/dtos/department/create-department.dto';
import { DepartmentResponseDto } from '@shared/dtos/department/department-response.dto';
import { ICloudinaryService } from '../cloudinary/cloudinary.service.interface';
import { BusinessFile } from 'src/entities/business-file.entity';
import { BusinessTypeLabels } from 'src/enums/business-type.labels';
import { RegionService } from '../region/region.service';
import { plainToInstance } from 'class-transformer';
import { UpdateDepartmentDto } from '@shared/dtos/department/update-department.dto';
import { PaginationQueryDto } from '@shared/dtos/pagination/pagination-query.dto';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { BusinessType } from 'src/enums/businessType.enum';
import { IReportPeriodService, IReportService } from '../report-period/report-period.service.interface';
import { ReportState } from 'src/enums/report-state.enum';
import { Report } from 'src/entities/report.entity';


@Injectable()
export class DepartmentService implements IDepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(BusinessFile)
    private businessFileRepository: Repository<BusinessFile>,
    @Inject('ICloudinaryService')
    private readonly cloudinaryService: ICloudinaryService,
    @Inject('IReportPeriodService')
    private readonly reportPeriodService: IReportPeriodService,
    @Inject('IReportService')
    private readonly reportService: IReportService,
    private readonly regionService: RegionService,
    private readonly dataSource: DataSource,
  ) { }
  //Hàm lấy tên region theo id
  private async getRegionNames(regionLevel1Id?: string, regionLevel2Id?: string, regionLevel3Id?: string) {
    if (!regionLevel1Id) return { city: null, district: null, ward: null };
    const city = await this.regionService.getLevel1Name(regionLevel1Id);
    const district = regionLevel2Id ? await this.regionService.getLevel2Name(regionLevel1Id, regionLevel2Id) : null;
    const ward = regionLevel2Id && regionLevel3Id ? await this.regionService.getLevel3Name(regionLevel1Id, regionLevel2Id, regionLevel3Id) : null;
    return { city, district, ward };
  }

  async findAll(pagination: PaginationQueryDto) {
    const { page = 1, limit = 10 } = pagination;
    const [departments, total] = await this.departmentRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { registration_date: 'DESC' },
      relations: ['businessFiles'],
    });

    const rawData = await Promise.all(
      departments.map(async (dept) => {
        const { city, district, ward } = await this.getRegionNames(
          dept.region_level1_id,
          dept.region_level2_id,
          dept.region_level3_id);
        const { city: operationCity, district: operationDistrict, ward: operationWard } =
          await this.getRegionNames(
            dept.operation_region_level1_id,
            dept.operation_region_level2_id,
            dept.operation_region_level3_id,
          );
        return {
          ...dept,
          business_type_label: BusinessTypeLabels[dept.business_type],
          city: city,
          district: district,
          ward: ward,
          operationCity,
          operationDistrict,
          operationWard,
          business_file: dept.businessFiles.map(file => ({
            id: file.id,
            name: file.name,
            url: file.url
          }))
        };
      }));

    const data = plainToInstance(DepartmentResponseDto, rawData, {
      excludeExtraneousValues: true,
    });
    return {
      data,
      meta: {
        totalItems: total,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  async getActiveDepartments(): Promise<Department[]> {
    return this.departmentRepository.find({
      where: { status: true },
      order: { name: 'ASC' },
    });
  }

  async findById(id: string): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: { id },
      relations: ['businessFiles'],
    });
    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    const { city, district, ward } = await this.getRegionNames(
      department.region_level1_id,
      department.region_level2_id,
      department.region_level3_id
    );

    const { city: operationCity, district: operationDistrict, ward: operationWard } =
      await this.getRegionNames(
        department.operation_region_level1_id,
        department.operation_region_level2_id,
        department.operation_region_level3_id
      );
    const rawData = {
      ...department,
      business_type_label: BusinessTypeLabels[department.business_type],
      city,
      district,
      ward,
      operationCity,
      operationDistrict,
      operationWard,
      business_file: department.businessFiles.map(file => ({
        id: file.id,
        name: file.name,
        url: file.url
      }))
    };

    return rawData;
  }

  async checkUserCanBeHead(email: string) {
    const departmentWithThisHead = await this.departmentRepository.findOne({
      where: {
        headEmail: email
      },
    });

    if (departmentWithThisHead) {
      throw new BadRequestException('Email này đã là trưởng phòng của một phòng ban khác');
    }

    const user = await this.userRepository.findOne({
      where: {
        email
      },
    });
    if (user) {
      throw new BadRequestException('Email này đã tồn tại trong hệ thống');
    }
  }

  async checkTaxCode(taxCode: string): Promise<{ isAvailable: boolean; message: string }> {
    const existing = await this.departmentRepository.findOne({
      where: { tax_code: taxCode },
    });

    return {
      isAvailable: !existing,
      message: existing
        ? `Mã số thuế '${taxCode}' đã tồn tại.`
        : `Mã số thuế '${taxCode}' có thể sử dụng.`,
    };
  }

  // Hàm upfile lên cloudinary
  private async uploadBusinessFile(
    files: Express.Multer.File[] | undefined,
    displayName: string,
    department: Department,
  ): Promise<BusinessFile | null> {
    if (!files?.length) return null;
    const uploadResult = await this.cloudinaryService.uploadFile(files[0]);
    return this.businessFileRepository.create({
      name: displayName,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      department,
    });
  }

  async create(
    createDto: CreateDepartmentDto,
    files: {
      business_license?: Express.Multer.File[],
      other_document?: Express.Multer.File[],
    }
  ): Promise<Department> {

    if (createDto.tax_code?.trim()) {
      const isValid = await this.checkTaxCode(createDto.tax_code.trim());
      if (!isValid.isAvailable) {
        throw new BadRequestException('Mã số thuế không hợp lệ');
      }
    }
    const department = this.departmentRepository.create(createDto);

    if (createDto.headEmail?.trim()) {
      const headEmail = createDto.headEmail.trim();

      // Gọi hàm kiểm tra hợp lệ
      await this.checkUserCanBeHead(headEmail);

      // Nếu không bị throw exception, thì gán
      department.headEmail = headEmail;
    }

    const savedDepartment = await this.departmentRepository.save(department);

    // Lấy tất cả kỳ báo cáo hiện tại
    const reportPeriods = await this.reportPeriodService.getAllRelevantReportPeriods();
    const currentDate = new Date();

    // Duyệt qua từng kỳ báo cáo
    for (const period of reportPeriods) {
      const startDate = new Date(period.startDate);
      const endDate = new Date(period.endDate);

      // Xác nhận ngày hiện tại nằm trong khoảng startDate và endDate
      if (currentDate >= new Date(period.startDate) && currentDate <= new Date(period.endDate)) {
        await this.reportService.createReport({
          departmentId: savedDepartment.id,
          reportPeriodId: period.id,
          state: ReportState.Expired,
        });
      }
    }

    const businessFile = await this.uploadBusinessFile(files.business_license, 'Giấy phép kinh doanh', savedDepartment);
    const otherFile = await this.uploadBusinessFile(files.other_document, 'Giấy tờ khác', savedDepartment);

    const businessFiles = [businessFile, otherFile].filter(f => f !== null);
    if (businessFiles.length) {
      await this.businessFileRepository.save(businessFiles);
    }
    return savedDepartment;
  }

  async toggleStatus(id: string): Promise<void> {
    const department = await this.departmentRepository.findOneBy({ id });
    if (!department) {
      throw new NotFoundException(`Không tìm thấy Department với id:  ${id} `);
    }

    department.status = !department.status;
    await this.departmentRepository.save(department);

    // await this.userRepository.update(
    //   { department: { id } }, // điều kiện: user.department.id = id
    //   { status: department.status }
    // );
    if (!department.status) {
      await this.userRepository.update(
        { department: { id } },
        { status: false }
      );
    }
  }
  //Hàm xóa file lưu ở cloudinary theo publicId
  private async deleteCloudinaryFile(public_id: string) {
    try {
      await this.cloudinaryService.deleteFile(public_id);
    } catch (error) {
      console.error(`Không thể xóa file Cloudinary: ${public_id}`, error);
    }
  }

  async deleteOne(id: string): Promise<void> {
    const department = await this.departmentRepository.findOne({
      where: { id },
      relations: ['businessFiles'],
    });

    if (!department) {
      throw new NotFoundException(`Không tìm thấy đơn vị với ID ${id}`);
    }

    for (const file of department.businessFiles) {
      if (file.public_id) {
        await this.deleteCloudinaryFile(file.public_id);
      }
    }
    await this.departmentRepository.remove(department);
  }

  async deleteMany(ids: string[]): Promise<{ deleted: number }> {
    if (ids.length === 0) {
      throw new BadRequestException('Danh sách ID không được để trống');
    }

    const departments = await this.departmentRepository.find({
      where: { id: In(ids) },
      relations: ['businessFiles'],
    });

    if (departments.length === 0) {
      throw new NotFoundException('Không tìm thấy bất kỳ đơn vị nào');
    }

    for (const dept of departments) {
      for (const file of dept.businessFiles) {
        if (file.public_id) {
          await this.deleteCloudinaryFile(file.public_id);
        }
      }
    }
    await this.departmentRepository.remove(departments);

    return { deleted: departments.length };
  }

  private async updateSingleFile(
    queryRunner: QueryRunner,
    file: Express.Multer.File,
    displayName: string,
    existingFile: BusinessFile | undefined,
    department: Department,
  ): Promise<BusinessFile> {
    if (existingFile) {
      await this.cloudinaryService.deleteFile(existingFile.public_id);
      await queryRunner.manager.delete(BusinessFile, existingFile.id);
    }

    const uploaded = await this.cloudinaryService.uploadFile(file);
    return this.businessFileRepository.create({
      name: displayName,
      url: uploaded.secure_url,
      public_id: uploaded.public_id,
      department,
    });
  }

  async update(id: string, updateDto: UpdateDepartmentDto,
    files?: {
      business_license?: Express.Multer.File[],
      other_document?: Express.Multer.File[],
    },
  ): Promise<Department> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const department = await queryRunner.manager.findOne(Department, {
        where: { id },
        relations: ['businessFiles'],
      });

      if (!department) {
        throw new NotFoundException(`Không tìm thấy Department với id: ${id}`);
      }

      // Cập nhật các trường còn lại nếu có giá trị hợp lệ
      Object.entries(updateDto).forEach(([key, value]) => {
        if (
          key !== 'tax_code' &&
          key !== 'id' &&
          value !== undefined &&
          value !== null &&
          value !== ''
        ) {
          department[key] = value;
        }
      });

      await queryRunner.manager.save(department);

      // Xử lý file (xóa cũ, upload mới)
      const newBusinessFiles = [];

      const handleFileUpdate = async (
        fieldName: 'business_license' | 'other_document',
        displayName: string
      ) => {
        const existingFile = department.businessFiles.find(f => f.name === displayName);
        const fileArray = files?.[fieldName] ?? [];

        if (fileArray.length === 0 && existingFile) {

          // Xóa file cũ nếu có
          await this.cloudinaryService.deleteFile(existingFile.public_id);
          await queryRunner.manager.delete(BusinessFile, existingFile.id);

          department.businessFiles = department.businessFiles.filter(f => f.id !== existingFile.id);
          return;
        }
        if (fileArray.length > 0) {
          // 🔄 CẬP NHẬT file
          const newFile = await this.updateSingleFile(
            queryRunner,
            fileArray[0],
            displayName,
            existingFile,
            department
          );
          newBusinessFiles.push(newFile);
        }
      };

      await handleFileUpdate('business_license', 'Giấy phép kinh doanh');
      await handleFileUpdate('other_document', 'Giấy tờ khác');

      if (newBusinessFiles.length) {
        await queryRunner.manager.save(BusinessFile, newBusinessFiles);
      }

      await queryRunner.commitTransaction();

      return department;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  //xuất excel
  async exportToExcel(ids: string[], res: Response): Promise<void> {
    const departments = await this.departmentRepository.find({
      where: { id: In(ids) },
      relations: ['businessFiles'],
      order: { registration_date: 'DESC' },

    });


    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Departments');

    // Thêm header
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Tên doanh nghiệp', key: 'name', width: 40 },
      { header: 'Mã số thuế', key: 'tax_code', width: 20 },
      { header: 'Loại hình kinh doanh', key: 'business_type', width: 25 },
      { header: 'Ngành nghề kinh doanh', key: 'business_industry_code', width: 30 },

      { header: 'Thành phố', key: 'city', width: 30 },
      { header: 'Quận/ huyện', key: 'district', width: 20 },
      { header: 'Phường/ xã', key: 'ward', width: 20 },
      { header: 'Địa chỉ', key: 'address', width: 40 },

      { header: 'Email trưởng phòng', key: 'headEmail', width: 15 },
      { header: 'Ngày đăng ký', key: 'registration_date', width: 18 },
      { header: 'Trạng thái', key: 'status', width: 15 },

      { header: 'Giấy phép kinh doanh (URL)', key: 'licenseBusinessUrl', width: 40 },
      { header: 'URL Giấy phép khác (URL)', key: 'ortherLicenseUrl', width: 40 },
    ];

    // Style cho header
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, size: 12 };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFEFEFEF' }, // màu xám nhạt
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Thêm dữ liệu
    for (const dept of departments) {
      const { city, district, ward } = await this.getRegionNames(
        dept.region_level1_id,
        dept.region_level2_id,
        dept.region_level3_id,
      );

      const licenseBusiness = dept.businessFiles?.find(f =>
        f.name?.toLowerCase().includes('kinh doanh')
      );
      const ortherLicense = dept.businessFiles?.find(f =>
        f.name?.toLowerCase().includes('khác')
      );

      const row = worksheet.addRow({
        id: dept.id,
        name: dept.name,
        tax_code: dept.tax_code,
        business_type: BusinessTypeLabels[dept.business_type as BusinessType] || 'Không xác định',
        business_industry_code: dept.business_industry_code,
        city: city || 'Không xác định',
        district: district || 'Không xác định',
        ward: ward || 'Không xác định',
        address: dept.address || 'Không xác định',

        headEmail: dept.headEmail,
        registration_date: dept.registration_date
          ? new Date(dept.registration_date).toLocaleDateString('vi-VN')
          : '',
        status: dept.status ? 'Hoạt động' : 'Ngưng hoạt động',
        licenseBusinessUrl: licenseBusiness?.url ?? '',
        ortherLicenseUrl: ortherLicense?.url ?? '',
      });
      // Style cho từng dòng (căn trái, viền nhẹ nếu muốn)
      row.eachCell((cell) => {
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      });
    };

    // Gửi file về client
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=departments.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  }


  async importFromExcel(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required');

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file.buffer);
    const worksheet = workbook.worksheets[0];

    const departments: Department[] = [];
    const skipped: { row: number; reason: string }[] = [];

    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
      const row = worksheet.getRow(rowNumber);

      const name = row.getCell(1).text.trim();
      const tax_code = row.getCell(2).text.trim();
      const business_type = row.getCell(3).text.trim() as BusinessType;
      if (!Object.values(BusinessType).includes(business_type)) {
        skipped.push({ row: rowNumber, reason: 'Invalid business_type' });
        return;
      }

      const industry_code = row.getCell(4).text.trim();
      const city = row.getCell(5).text.trim();
      const district = row.getCell(6).text.trim();
      const ward = row.getCell(7).text.trim();
      const address = row.getCell(8).text.trim();
      const headName = row.getCell(9).text.trim();

      const registration_date = row.getCell(10).text.trim();

      const headEmail = row.getCell(11).text.trim();
      const headPhone = row.getCell(12).text.trim();

      if (!tax_code) {
        skipped.push({ row: rowNumber, reason: 'Missing tax_code' });
        return;
      }

      const existed = await this.departmentRepository.findOne({ where: { tax_code } });
      if (existed) {
        skipped.push({ row: rowNumber, reason: `Duplicate tax_code ${tax_code}` });
        return;
      }

      const { level1Id, level2Id, level3Id } =
        this.regionService.getRegionIdsByNames(city, district, ward);

      const department = this.departmentRepository.create({
        name,
        tax_code,
        region_level1_id: level1Id,
        region_level2_id: level2Id,
        region_level3_id: level3Id,
        address,
        business_type,
        business_industry_code: industry_code,
        registration_date: this.parseExcelDate(registration_date),
        headName,
        headEmail,
        headPhone,
      });

      departments.push(department);
    };

    await this.departmentRepository.save(departments);
    return { message: 'Import thành công', total: departments.length, skipped, };
  }


  private parseExcelDate(value: string): Date | null {
    if (!value) return null;

    const parts = value.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts.map(part => Number(part.trim()));
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month - 1, day); // month - 1 vì JS đếm tháng từ 0
      }
    }

    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
}

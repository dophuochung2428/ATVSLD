import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { IUserService } from './user.service.interface';
import { CreateUserDto } from '@shared/dtos/user/create-user.dto';
import { Role } from 'src/entities/role.entity';
import { Department } from 'src/entities/department.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '@shared/dtos/user/update-user.dto';
import { UserType, UserTypeLabel } from 'src/enums/userType.enum';
import { IRoleService } from '../role/role.service.interface';
import { UserDto } from '@shared/dtos/user/user.dto';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { Gender, GenderLabel } from 'src/enums/gender.enum';
import { RegionService } from '../region/region.service';
import { parseGenderLabel, parseUserTypeLabel } from 'src/ustils/enum.ustils';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @Inject('IRoleService')
    private readonly roleService: IRoleService,
    private readonly regionService: RegionService,
    private readonly dataSource: DataSource,
  ) { }

  private async getRegionNames(regionLevel1Id?: string, regionLevel2Id?: string, regionLevel3Id?: string) {
    if (!regionLevel1Id) return { city: null, district: null, ward: null };
    const city = await this.regionService.getLevel1Name(regionLevel1Id);
    const district = regionLevel2Id ? await this.regionService.getLevel2Name(regionLevel1Id, regionLevel2Id) : null;
    const ward = regionLevel2Id && regionLevel3Id ? await this.regionService.getLevel3Name(regionLevel1Id, regionLevel2Id, regionLevel3Id) : null;
    return { city, district, ward };
  }
  private async mapUserDetail(user: User): Promise<User> {
    const { city, district, ward } = await this.getRegionNames(user.city, user.district, user.ward);
    user.city = city;
    user.district = district;
    user.ward = ward;

    // Xóa password cho an toàn
    delete user.password;

    // Thêm tên role/department tùy theo userType
    if (user.userType === UserType.BUSINESS) {
      (user as any).departmentName = user.department?.name || null;
    } else if (user.userType === UserType.ADMIN) {
      (user as any).roleName = user.role?.name || null;
    }

    return user;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find({ relations: ['role', 'department'] });
    return await Promise.all(users.map(user => this.mapUserDetail(user)));
  }

  async findUserById(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role', 'department'],
    });
    if (!user) return null;
    return await this.mapUserDetail(user);
  }


  async findById(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role', 'role.rolePermissions', 'role.rolePermissions.permission', 'department'],
    });
    if (!user) return null;
    return await this.mapUserDetail(user);
  }

  async findPermissionWithRoleId(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id, status: true },
      relations: {
        role: {
          rolePermissions: {
            permission: true,
          },
        },
      },
    });

    if (user) {
      delete user.password;
    }

    return user;
  }


  async findByAccount(account: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { account },
      relations: ['role', 'department'],
    });
    if (!user) throw new NotFoundException(`User with account ${account} not found`);
    return await this.mapUserDetail(user);
  }

  async findByAccountWithPassword(account: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { account },
      relations: ['role', 'department'],
    });
    if (!user) throw new NotFoundException(`User with account ${account} not found`);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role', 'department'],
    });
    if (!user) throw new NotFoundException(`User with email ${email} not found`);
    return await this.mapUserDetail(user);
  }

  async findByAccountWithDepartment(account: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { account },
      relations: ['department'],
    });
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await this.userRepository.update(userId, { password: hashedPassword });
  }

  async resetPassword(userId: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const defaultPassword = 'Abcd1@34';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    await this.updatePassword(user.id, hashedPassword);
  }

  async create(dto: CreateUserDto): Promise<User> {
    const { password, departmentId, roleId, userType, ...rest } = dto;

    const usernameExists = await this.userRepository.findOne({ where: { account: rest.account } });
    if (usernameExists) {
      throw new BadRequestException('Tên tài khoản đã tồn tại');
    }

    const emailExists = await this.userRepository.findOne({ where: { email: rest.email } });
    if (emailExists) {
      throw new BadRequestException('Email đã tồn tại');
    }

    const user = this.userRepository.create({
      ...rest,
      password,
      userType
    });

    if (userType === UserType.BUSINESS) {
      if (!departmentId) {
        throw new BadRequestException('Loại tài khoản này cần cung cấp thông tin doanh nghiệp');
      }
      if (roleId) {
        throw new BadRequestException('Loại tài khoản này không cần thông tin role');
      }
      const department = await this.departmentRepository.findOneBy({ id: departmentId });
      if (!department || !department.status) throw new NotFoundException('Doanh nghiệp đang ngưng hoạt động');
      user.department = department;

      const role = await this.roleService.getByCode("USER");
      if (!role) throw new NotFoundException('Không tìm thấy quyền yêu cầu');
      user.role = role;

      // if (department.headEmail) {
      //   user.email = department.headEmail;
      // }
    }
    else if (userType === UserType.ADMIN) {
      if (!roleId) {
        throw new BadRequestException('Loại tài khoản này cần phân quyền');
      }
      if (departmentId) {
        throw new BadRequestException('Loại tài khoản này không cần thông tin doanh nghiệp');
      }
      const role = await this.roleRepository.findOneBy({ id: roleId });
      if (!role) throw new NotFoundException('Không tìm thấy quyền cần thiết lập');
      user.role = role;
      user.department = null;
    }
    else {
      throw new BadRequestException('Loại tài khoản không hợp lệ');
    }
    return this.userRepository.save(user);
  }


  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role', 'department'],
    });
    if (!user) throw new NotFoundException('Không tìm thấy user');

    if (user.userType === UserType.ADMIN) {
      if (dto.departmentId && dto.departmentId !== user.department?.id) {
        throw new BadRequestException('Tài khoản quản trị không cần thông tin doanh nghiệp');
      }
      if (dto.roleId && dto.roleId !== user.role?.id) {
        const role = await this.roleRepository.findOneBy({ id: dto.roleId });
        if (!role) throw new NotFoundException('Không tìm thấy quyền cần thiết');
        user.role = role;
      }
    } else if (user.userType === UserType.BUSINESS) {
      if (dto.roleId && dto.roleId !== user.role?.id) {
        throw new BadRequestException('Tài khoản doanh nghiệp không thể có thông tin quyền');
      }
      if (dto.departmentId && dto.departmentId !== user.department?.id) {
        const department = await this.departmentRepository.findOneBy({ id: dto.departmentId });

        if (!department) throw new NotFoundException('không tìm thấy doanh nghiệp');

        if (!department.status) {
          throw new BadRequestException('Không thể chuyển sang doanh nghiệp đang ngưng hoạt động');
        }
        user.department = department;
      }
    }
    Object.assign(user, dto);
    user.status = dto.active;
    return this.userRepository.save(user);
  }

  async deleteMany(ids: string[]): Promise<void> {
    const users = await this.userRepository.findBy({ id: In(ids) });
    if (!users.length) throw new NotFoundException('No users found to delete');

    await this.userRepository.remove(users);
  }

  async toggleStatus(id: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['department'],
    });
    if (!user) {
      throw new NotFoundException(`Không tìm thấy User với id:  ${id} `);
    }

    if (!user.status) {
      if (user.department && !user.department.status) {
        throw new BadRequestException(
          'Không thể bật user vì doanh nghiệp chưa được kích hoạt.',
        );
      }
    }

    user.status = !user.status;

    await this.userRepository.save(user);
  }

  async exportUsersToExcel(ids: string[], res: Response): Promise<void> {
    const users = await this.userRepository.find({
      where: { id: In(ids) },
      relations: ['department', 'role']
    })

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Account', key: 'account', width: 20 },
      { header: 'Full Name', key: 'fullName', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Job Title', key: 'jobTitle', width: 20 },
      { header: 'Address', key: 'address', width: 40 },
      { header: 'Birth Day', key: 'birthDay', width: 15 },
      { header: 'Gender', key: 'genderLabel', width: 10 },
      { header: 'User Type', key: 'userTypeLabel', width: 15 },
      { header: 'Status', key: 'status', width: 10 },
      { header: 'City', key: 'city', width: 15 },
      { header: 'District', key: 'district', width: 15 },
      { header: 'Ward', key: 'ward', width: 15 },
      { header: 'Department', key: 'departmentName', width: 20 },
      { header: 'Role', key: 'roleName', width: 20 },
      { header: 'Avatar URL', key: 'avatar', width: 40 },
    ];

    for (const user of users) {
      const { city, district, ward } = await this.getRegionNames(user.city, user.district, user.ward);


      // Thêm dữ liệu user
      worksheet.addRow({
        id: user.id,
        account: user.account,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        jobTitle: user.jobTitle,
        address: user.address,
        birthDay: user.birthDay ? new Date(user.birthDay).toLocaleDateString('vi-VN') : '',
        genderLabel: GenderLabel[user.gender],
        userTypeLabel: UserTypeLabel[user.userType],
        status: user.status ? 'Active' : 'Inactive',
        city,
        district,
        ward,
        departmentName: user.department?.name,
        roleName: user.role?.name,
        avatar: user.avatar,
      });
    }

    // Gửi file về client
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  }

  async createUsersFromExcel(buffer: Buffer): Promise<{ createdUsers: User[]; errors: string[] }> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.getWorksheet(1);

    const createdUsers: User[] = [];
    const errors: string[] = [];

    for (let i = 2; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);

      try {
        const gender = parseGenderLabel(row.getCell(9).text.trim());
        const userType = parseUserTypeLabel(row.getCell(10).text.trim());

        if (!gender) throw new Error(`Giới tính không hợp lệ: ${row.getCell(9).text.trim()}`);
        if (!userType) throw new Error(`Loại người dùng không hợp lệ: ${row.getCell(10).text.trim()}`);

        // Lấy tên department và role từ Excel
        const departmentName = row.getCell(11).text.trim();
        const roleName = row.getCell(12).text.trim();

        let departmentId: string | null = null;
        let roleId: string | null = null;

        if (userType === UserType.BUSINESS) {
          // Tìm department theo tên
          const department = await this.departmentRepository.findOne({ where: { name: departmentName } });
          if (!department) throw new Error(`Không tìm thấy phòng ban/doanh nghiệp: ${departmentName}`);
          departmentId = department.id;
        } else if (userType === UserType.ADMIN) {
          // Tìm role theo tên
          const role = await this.roleRepository.findOne({ where: { name: roleName } });
          if (!role) throw new Error(`Không tìm thấy vai trò: ${roleName}`);
          roleId = role.id;
        }

        const dto: CreateUserDto = {
          account: row.getCell(1).text.trim(),
          password: row.getCell(2).text.trim(),
          fullName: row.getCell(3).text.trim(),
          email: row.getCell(4).text.trim(),
          phone: row.getCell(5).text.trim(),
          jobTitle: row.getCell(6).text.trim(),
          address: row.getCell(7).text.trim(),
          birthDay: row.getCell(8).text.trim() ? new Date(row.getCell(8).text.trim()) : null,
          gender,
          userType,
          departmentId,
          roleId,
        };

        const createdUser = await this.create(dto);
        createdUsers.push(createdUser);
      } catch (error) {
        errors.push(`Dòng ${i}: ${error.message || 'Lỗi không xác định'}`);
      }
    }

    return { createdUsers, errors };
  }





}

import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateRoleDto } from "@shared/dtos/role/create-role.dto";
import { Permission } from "src/entities/permission.entity";
import { RolePermission } from "src/entities/role-permission.entity";
import { Role } from "src/entities/role.entity";
import { DataSource, In, Not, Repository } from "typeorm";
import { IRoleService } from "./role.service.interface";
import { UpdateRoleDto } from "@shared/dtos/role/update-role.dto";

@Injectable()
export class RoleService implements IRoleService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepo: Repository<Permission>,
    @InjectRepository(RolePermission)
    private rolePermissionRepo: Repository<RolePermission>,
  ) { }

  async getAllRoles(): Promise<Role[]> {
    return await this.roleRepo.find({
      relations: ['rolePermissions', 'rolePermissions.permission'],
      order: { name: 'ASC' },
    });
  }

  async getById(id: string): Promise<Role> {
    const role = await this.roleRepo.findOne({
      where: { id },
      relations: ['rolePermissions', 'rolePermissions.permission'],
    });
    if (!role) throw new BadRequestException('Role không tồn tại');
    return role;
  }

  async getByCode(code: string): Promise<Role> {
    const role = await this.roleRepo.findOne({
      where: { code },
      relations: ['rolePermissions', 'rolePermissions.permission'],
    });

    if (!role) throw new BadRequestException('Role không tồn tại');
    return role;
  }


  async createRole(dto: CreateRoleDto): Promise<Role> {
    const { code, name, permissionIds = [] } = dto;

    return await this.dataSource.transaction(async (manager) => {

      // Kiểm tra code có bị trùng không
      const exist = await manager.findOne(Role, {
        where: { code },
      });
      if (exist) throw new BadRequestException('Role code đã tồn tại');

      // Tạo role
      const role = manager.create(Role, { code, name });
      await manager.save(role);

      const selectedPermissions = await manager.findBy(Permission, {
        id: In(permissionIds),
      });

      // Gán permission
      const rolePermissions = selectedPermissions.map((perm) =>
        manager.create(RolePermission, {
          role,
          permission: perm,
        }),
      );
      await manager.save(rolePermissions);

      return role;
    });
  }

  async updateRole(id: string, dto: UpdateRoleDto): Promise<Role> {
    const { name, permissionIds = [] } = dto;

    return await this.dataSource.transaction(async (manager) => {

      const role = await manager.findOne(Role, { where: { id } });
      if (!role) throw new BadRequestException('Role không tồn tại');

      role.name = name;
      await manager.save(role);

      const currentRolePermissions = await manager.find(RolePermission, {
        where: { role: { id } },
        relations: ['permission'],
      });

      const currentPermissionIds = currentRolePermissions.map(rp => rp.permission.id);

      // Tính toán permission cần thêm và cần xóa
      const toAddIds = permissionIds.filter(id => !currentPermissionIds.includes(id));
      const toRemoveIds = currentPermissionIds.filter(id => !permissionIds.includes(id));

      // Xóa các permission không còn
      if (toRemoveIds.length > 0) {
        await manager.delete(RolePermission, {
          role: { id },
          permission: In(toRemoveIds),
        });
      }

      // Thêm các permission mới
      if (toAddIds.length > 0) {
        const permissionsToAdd = await manager.findBy(Permission, { id: In(toAddIds) });

        const newRolePermissions = permissionsToAdd.map((perm) =>
          manager.create(RolePermission, {
            role,
            permission: perm,
          }),
        );
        await manager.save(newRolePermissions);
      }

      // Trả về role đã cập nhật kèm permissions
      const updatedRole = await manager.findOne(Role, {
        where: { id },
        relations: ['rolePermissions', 'rolePermissions.permission'],
      });

      return updatedRole;
    });
  }

  async deleteRoles(ids: string[]): Promise<void> {
    return await this.dataSource.transaction(async (manager) => {

      const roles = await manager.findBy(Role, { id: In(ids) });
      if (roles.length !== ids.length) {
        throw new NotFoundException('Có role không tồn tại');
      }


      await manager.delete(RolePermission, { role: { id: In(ids) } });


      await manager.delete(Role, { id: In(ids) });
    });
  }


}
